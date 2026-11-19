import { drawBoat } from "./entities/boat";
import { drawSeafloor } from "./entities/seafloor";
import { createSchool, drawSchool } from "./entities/school";
import { drawSky } from "./entities/sky";
import { depthBus } from "./events";
import { createInput } from "./input";
import { depthAt, readFloor, readStops, readSurface, type Stop } from "./scroll";
import { drawFish, FISH_H, FISH_W } from "./sprites";
import type { World } from "./world";

type Bubble = { x: number; y: number; life: number };

const PX = 3; // one sprite pixel = 3 css pixels (72 x 42 fish)
const LANE = 170; // width of the fish's lane at the right edge

export function createEngine(canvas: HTMLCanvasElement, opts: { reducedMotion: boolean }) {
  const ctx = canvas.getContext("2d")!;
  // reduced motion: leave the arrow keys to the browser's own scrolling
  const input = opts.reducedMotion ? null : createInput();
  const school = createSchool();
  const bubbles: Bubble[] = [];
  let stops: Stop[] = [];
  let tilt = 0;
  let lastY = scrollY;
  let swimX = 0; // distance swum left from the home lane
  let raf = 0;
  const world: World = {
    w: 0, h: 0, t: 0, scrollY: 0, surfaceY: 0, floorY: 0, depth: 0,
    moving: 0, reduced: opts.reducedMotion, fishX: 0, fishY: 0, facing: 1,
  };

  function measure() {
    stops = readStops();
    world.surfaceY = readSurface();
    world.floorY = readFloor();
  }

  function resize() {
    const dpr = devicePixelRatio || 1;
    world.w = innerWidth;
    world.h = innerHeight;
    canvas.width = world.w * dpr;
    canvas.height = world.h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    measure();
    frame(0);
  }

  function frame(t: number) {
    const vy = scrollY - lastY;
    lastY = scrollY;
    world.t = t;
    world.scrollY = scrollY;
    world.moving = Math.min(Math.abs(vy) / 20, 1);
    world.depth = Math.round(depthAt(stops, scrollY + world.h / 2));
    depthBus.set(world.depth);

    if (input) {
      if (input.held("up")) scrollBy({ top: -14, behavior: "instant" });
      if (input.held("down")) scrollBy({ top: 14, behavior: "instant" });
      const dx = (input.held("right") ? 1 : 0) - (input.held("left") ? 1 : 0);
      if (dx) world.facing = dx > 0 ? -1 : 1; // sprite head points left
      swimX = Math.max(0, Math.min(world.w - LANE, swimX - dx * 5));
    }

    const target = opts.reducedMotion ? 0 : Math.max(-1, Math.min(1, vy / 20)) * 32; // head-down when diving
    tilt += (target - tilt) * 0.1;

    const narrow = world.w < 640;
    const surfaceScreen = world.surfaceY - scrollY;
    world.fishX = narrow ? world.w - 50 : world.w - 85 - swimX;
    // below the waterline at the top of the page, then held at 42% of the screen
    const base = narrow ? world.h - 70 : world.h * 0.42;
    world.fishY = Math.max(base, surfaceScreen + 70) + (opts.reducedMotion ? 0 : Math.sin(t / 600) * 6);

    ctx.clearRect(0, 0, world.w, world.h);
    drawSky(ctx, world);
    drawSchool(ctx, world, school);
    drawBoat(ctx, world);
    drawSeafloor(ctx, world);

    if (!opts.reducedMotion) {
      if (Math.random() < 0.02 + world.moving * 0.08) bubbles.push({ x: world.fishX - world.facing * 30, y: world.fishY, life: 1 });
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i]!;
        b.y -= 0.8;
        b.life -= 0.012;
        if (b.life <= 0) bubbles.splice(i, 1);
        else {
          ctx.strokeStyle = `rgb(143 179 182 / ${b.life})`;
          ctx.strokeRect(b.x, b.y, 4, 4);
        }
      }
    }

    ctx.save();
    ctx.translate(world.fishX, world.fishY);
    ctx.scale(world.facing, 1);
    ctx.rotate((tilt * Math.PI) / 180);
    ctx.scale(PX, PX);
    ctx.translate(-FISH_W / 2, -FISH_H / 2);
    drawFish(ctx, !opts.reducedMotion && Math.floor(t / (world.moving > 0.2 ? 120 : 300)) % 2 === 0);
    ctx.restore();
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
