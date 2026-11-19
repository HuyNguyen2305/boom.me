import { depthEvents } from "./events";
import { depthAt, readStops, type Stop } from "./scroll";
import { drawFish, FISH_H, FISH_W } from "./sprites";

type Bubble = { x: number; y: number; life: number };

const PX = 6; // one sprite pixel = 6 css pixels (72 x 42 fish)

export function createEngine(canvas: HTMLCanvasElement, opts: { reducedMotion: boolean }) {
  const ctx = canvas.getContext("2d")!;
  let stops: Stop[] = [];
  let w = 0;
  let h = 0;
  let tilt = 0;
  let lastY = scrollY;
  let raf = 0;
  const bubbles: Bubble[] = [];

  function resize() {
    const dpr = devicePixelRatio || 1;
    w = innerWidth;
    h = innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    stops = readStops();
    frame(0);
  }

  function frame(t: number) {
    const vy = scrollY - lastY;
    lastY = scrollY;
    const moving = Math.min(Math.abs(vy) / 20, 1);
    const target = opts.reducedMotion ? 0 : Math.max(-1, Math.min(1, vy / 20)) * 32; // head-down when diving
    tilt += (target - tilt) * 0.1;

    depthEvents.emit(Math.round(depthAt(stops, scrollY + h / 2)));

    const narrow = w < 640;
    const fx = narrow ? w - 50 : 85;
    const fy = narrow ? h - 70 : h * 0.42 + (opts.reducedMotion ? 0 : Math.sin(t / 600) * 6);

    ctx.clearRect(0, 0, w, h);

    if (!opts.reducedMotion) {
      if (Math.random() < 0.02 + moving * 0.08) bubbles.push({ x: fx + (FISH_W * PX) / 2, y: fy, life: 1 });
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
    ctx.translate(fx + (FISH_W * PX) / 2, fy + (FISH_H * PX) / 2);
    ctx.rotate((tilt * Math.PI) / 180);
    ctx.scale(PX, PX);
    ctx.translate(-FISH_W / 2, -FISH_H / 2);
    drawFish(ctx, !opts.reducedMotion && Math.floor(t / (moving > 0.2 ? 120 : 300)) % 2 === 0);
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

  addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibility);
  // fonts/images can shift section tops after load
  const ro = new ResizeObserver(() => (stops = readStops()));
  ro.observe(document.body);
  resize();
  if (opts.reducedMotion) addEventListener("scroll", () => frame(0), { passive: true });
  else raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
