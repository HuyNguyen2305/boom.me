"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { createEngine } from "./engine";

const layer = "pointer-events-none fixed inset-0 size-full";

export default function Ocean() {
  const back = useRef<HTMLCanvasElement>(null);
  const front = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => createEngine(back.current!, front.current!, { reducedMotion }), [reducedMotion]);
  // z-10 water behind the page text (.column is z-20); z-40 the main fish over it; the header is z-50
  return (
    <>
      <canvas ref={back} aria-hidden className={`${layer} z-10`} />
      <canvas ref={front} aria-hidden className={`${layer} z-40`} />
    </>
  );
}
