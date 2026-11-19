"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { createEngine } from "./engine";

export default function Ocean() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => createEngine(ref.current!, { reducedMotion }), [reducedMotion]);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-10 size-full" />;
}
