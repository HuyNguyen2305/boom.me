import { helmBus } from "./events";

const MAP: Record<string, string> = {
  w: "up", arrowup: "up", s: "down", arrowdown: "down",
  a: "left", arrowleft: "left", d: "right", arrowright: "right",
};

/** Helm mode: W/S (or Up/Down) rise and dive, A/D (or Left/Right) swim sideways. Esc always exits. */
export function createInput() {
  const keys = new Set<string>();
  const onDown = (e: KeyboardEvent) => {
    if (!helmBus.get()) return;
    if (e.key === "Escape") return helmBus.set(false);
    const dir = MAP[e.key.toLowerCase()];
    if (!dir || e.ctrlKey || e.metaKey || e.altKey) return;
    e.preventDefault();
    keys.add(dir);
  };
  const onUp = (e: KeyboardEvent) => void keys.delete(MAP[e.key.toLowerCase()] ?? "");
  const onBlur = () => keys.clear();
  const off = helmBus.subscribe((on) => on || keys.clear());
  addEventListener("keydown", onDown);
  addEventListener("keyup", onUp);
  addEventListener("blur", onBlur);
  return {
    held: (d: string) => keys.has(d),
    destroy() {
      off();
      removeEventListener("keydown", onDown);
      removeEventListener("keyup", onUp);
      removeEventListener("blur", onBlur);
    },
  };
}
