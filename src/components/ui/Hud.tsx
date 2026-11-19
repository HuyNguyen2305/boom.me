"use client";
import { useEffect, useState } from "react";
import { depthBus } from "@/ocean/events";

export function Hud() {
  const [depth, setDepth] = useState(0);
  useEffect(() => depthBus.subscribe(setDepth), []);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-4 bottom-4 z-20 hidden border border-teal/20 bg-abyss/80 px-3 py-2 font-mono text-xs font-medium tracking-[0.08em] text-driftwood uppercase sm:block"
    >
      {depth} m
    </div>
  );
}
