"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { helmBus } from "@/ocean/events";

export function HelmButton() {
  const [on, setOn] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => helmBus.subscribe(setOn), []);
  if (reduced) return null;
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => helmBus.set(!on)}
      className="fixed bottom-4 left-4 z-20 hidden border border-teal/50 bg-abyss/80 px-3 py-2 font-mono text-xs text-teal sm:block"
    >
      {on ? "Esc: leave helm" : "Take the helm (WASD)"}
    </button>
  );
}
