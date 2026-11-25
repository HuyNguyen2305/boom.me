import { drawSurface } from "./entities/boat";
import { drawBuoy } from "./entities/buoy";
import { drawHint } from "./entities/hint";
import { drawSeafloor } from "./entities/seafloor";
import { createSchool, drawSchool, type Band } from "./entities/school";
import { drawSky } from "./entities/sky";
import { depthBus, fishXBus, fishYBus } from "./events";
import { createInput } from "./input";
import { depthAt, readFloor, readLane, readStops, readSurface, type Stop } from "./scroll";
import { drawFish, FISH_H, FISH_W } from "./sprites";
import type { World } from "./world";

type Bubble = { x: number; y: number; life: number };

const PX = 2; // the main fish is drawn at 2px pixels (40 x 25 cells = 80 x 50)
const EDGE = 60; // the fish may swim anywhere between these margins sideways
const LIMIT_TOP = 0.3; // vertical limits (fractions of the screen): at either one the page scrolls instead
const LIMIT_BOTTOM = 0.66;

// back: the water, sea life and floor (behind the page text). front: the main fish, its bubbles and the hint (over everything).
export function createEngine(back: HTMLCanvasElement, front: HTMLCanvasElement, opts: { reducedMotion: boolean }) {
  const ctx = back.getContext("2d")!;
  const fctx = front.getContext("2d")!;
  // reduced motion: leave the arrow keys to the browser's own scrolling
  const input = opts.reducedMotion ? null : createInput();
  const school = createSchool();
  const bubbles: Bubble[] = [];
  let stops: Stop[] = [];
  let tilt = 0;
  let lastY = scrollY;
  let sv = 0; // smoothed scroll speed
  let swimX = 0; // distance swum left (negative: right) from the home lane
  let used = false; // has the visitor steered yet? the hint fades once they have
  let hint = 1;
  let fyFrac = 0.42; // the fish's height on screen, as a fraction of the viewport
  let prevFy = 0;
  // The back canvas is a tall strip that scrolls natively with the page. Redrawing a fixed canvas from scrollY lags the
  // compositor by a frame on a trackpad and the sea life shakes. The strip is only moved when the view nears its edge.
  let anchor = 0; // document y of the strip's top
  let stripH = 0;
  let docH = 0;
  let raf = 0;
  const world: World = {
    w: 0, h: 0, t: 0, scrollY: 0, surfaceY: 0, floorY: 0, laneX: 0, depth: 0,
    moving: 0, reduced: opts.reducedMotion, fishX: 0, fishY: 0, facing: 1,
  };

  function measure() {
    stops = readStops();
    world.surfaceY = readSurface();
    world.floorY = readFloor();
    world.laneX = readLane();
    docH = document.body.offsetHeight; // not scrollHeight: the strip itself must never lengthen the page
    // one band of water per section: sea life lives inside its own layer
    const bands: Band[] = stops.map((s, i) => ({ top: s.top, bottom: stops[i + 1]?.top ?? world.floorY, depth: s.depth }));
    school.layout(bands);
  }

  function resize() {
    const dpr = devicePixelRatio || 1;
    world.w = innerWidth;
    world.h = innerHeight;
    stripH = world.h * 2;
    back.style.height = `${stripH}px`;
    for (const [c, x, h] of [[back, ctx, stripH], [front, fctx, world.h]] as const) {
      c.width = world.w * dpr;
      c.height = h * dpr;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      x.imageSmoothingEnabled = false;
    }
    measure();
    frame(0);
  }

  function frame(t: number) {
    // trackpad scrolling arrives in uneven bursts: smooth the speed so the tilt, bubbles and tail beat don't flicker
    sv += (scrollY - lastY - sv) * 0.15;
    const vy = sv;
    lastY = scrollY;
    world.t = t;
    world.scrollY = scrollY;
    world.moving = Math.min(Math.abs(vy) / 20, 1);

    const narrow = world.w < 640;
    const surfaceScreen = world.surfaceY - scrollY;
    let fy = narrow ? world.h - 70 : fyFrac * world.h;

    if (input) {
      const lo = world.h * LIMIT_TOP;
      const hi = world.h * LIMIT_BOTTOM;
      const atTop = scrollY <= 0;
      const atBottom = scrollY >= document.documentElement.scrollHeight - innerHeight - 1;
      const speed = 5;
      // the fish swims freely between the two limits; only when it is at one does the page scroll.
      // When the page cannot scroll any further the fish may go beyond the limit, up to the waterline or the bottom edge.
      if (input.held("up")) {
        if (fy > lo + 0.5) fy = Math.max(lo, fy - speed);
        else if (!atTop) scrollBy({ top: -14, behavior: "instant" });
        else fy = Math.max(surfaceScreen + 60, fy - speed);
      }
      if (input.held("down")) {
        if (fy < hi - 0.5) fy = Math.min(hi, fy + speed);
        else if (!atBottom) scrollBy({ top: 14, behavior: "instant" });
        else fy = Math.min(world.h - 90, fy + speed);
      }
      const dx = (input.held("right") ? 1 : 0) - (input.held("left") ? 1 : 0);
      if (dx) world.facing = dx > 0 ? -1 : 1; // sprite head points left
      swimX = Math.max(world.laneX - (world.w - EDGE), Math.min(world.laneX - EDGE, swimX - dx * 5));
      if (input.any()) used = true;
    }
    fy = Math.max(fy, surfaceScreen + 60); // never above the waterline
    if (!narrow) fyFrac = fy / world.h;
    hint += ((used || scrollY > 120 ? 0 : 1) - hint) * 0.08;

    const dyFish = prevFy ? fy - prevFy : 0;
    prevFy = fy;
    // head-down when diving, whether the fish itself swims down or the page scrolls down
    const target = opts.reducedMotion ? 0 : Math.max(-1, Math.min(1, (vy + dyFish) / 20)) * 32;
    tilt += (target - tilt) * 0.1;

    world.fishX = narrow ? world.w - 50 : world.laneX - swimX;
    world.fishY = fy + (opts.reducedMotion ? 0 : Math.sin(t / 600) * 6);
    fishXBus.set(world.fishX);
    fishYBus.set(world.fishY);

    world.depth = Math.round(depthAt(stops, scrollY + world.fishY)); // the fish's own depth
    depthBus.set(world.depth);

    // re-centre the strip on the view when it drifts near an edge; never past the end of the page
    const pad = (stripH - world.h) / 2;
    if (Math.abs(scrollY - pad - anchor) > pad * 0.75) {
      anchor = Math.round(Math.min(scrollY - pad, docH - stripH));
      back.style.top = `${anchor}px`;
    }
    const strip: World = { ...world, scrollY: anchor, h: stripH }; // the back layer's own frame: offset and height of the strip
    ctx.clearRect(0, 0, strip.w, strip.h);
    drawSky(ctx, strip);
    drawSchool(ctx, strip, school);
    drawBuoy(ctx, strip);
    drawSurface(ctx, strip);
    drawSeafloor(ctx, strip);

    fctx.clearRect(0, 0, world.w, world.h);
    if (!opts.reducedMotion) {
      if (Math.random() < 0.02 + world.moving * 0.08) bubbles.push({ x: world.fishX - (world.facing * FISH_W * PX) / 2, y: world.fishY, life: 1 });
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i]!;
        b.y -= 0.8;
        b.life -= 0.012;
        if (b.life <= 0) bubbles.splice(i, 1);
        else {
          fctx.strokeStyle = `rgb(143 179 182 / ${b.life})`;
          fctx.strokeRect(b.x, b.y, 4, 4);
        }
      }
    }

    fctx.save();
    fctx.translate(Math.round(world.fishX), Math.round(world.fishY));
    fctx.scale(world.facing, 1);
    fctx.rotate((-tilt * Math.PI) / 180); // head-down when diving (the sprite's head is on its left)
    fctx.scale(PX, PX);
    fctx.translate(-FISH_W / 2, -FISH_H / 2);
    drawFish(fctx, opts.reducedMotion ? 0 : t, world.moving > 0.2);
    fctx.restore();

    drawHint(fctx, world, hint);
  }

  function loop(t: number) {
    frame(t);
    raf = requestAnimationFrame(loop);
  }
  const onVisibility = () => {
    cancelAnimationFrame(raf);
    if (!document.hidden && !opts.reducedMotion) raf = requestAnimationFrame(loop);
  };
  const onScroll = () => frame(0);

  addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibility);
  const ro = new ResizeObserver(measure); // fonts/images can shift section tops after load
  ro.observe(document.body);
  resize();
  if (opts.reducedMotion) addEventListener("scroll", onScroll, { passive: true });
  else raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    input?.destroy();
    removeEventListener("resize", resize);
    removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
