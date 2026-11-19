const MAP: Record<string, string> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

/**
 * Arrow keys steer the fish: up/down rise and dive (scroll the page), left/right swim sideways.
 * Never active while typing in a field or while a dialog is open, so it cannot trap the keyboard.
 */
export function createInput() {
  const keys = new Set<string>();
  const onDown = (e: KeyboardEvent) => {
    const dir = MAP[e.key];
    if (!dir || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target) || document.querySelector("dialog[open]")) return;
    e.preventDefault();
    keys.add(dir);
  };
  const onUp = (e: KeyboardEvent) => void keys.delete(MAP[e.key] ?? "");
  const onBlur = () => keys.clear();
  addEventListener("keydown", onDown);
  addEventListener("keyup", onUp);
  addEventListener("blur", onBlur);
  return {
    held: (d: string) => keys.has(d),
    any: () => keys.size > 0,
    destroy() {
      removeEventListener("keydown", onDown);
      removeEventListener("keyup", onUp);
      removeEventListener("blur", onBlur);
    },
  };
}
