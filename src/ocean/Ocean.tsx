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
      {/* scrolls with the document (the engine sets its top and height), so the browser moves the water with the text */}
      <canvas ref={back} aria-hidden className="pointer-events-none absolute top-0 left-0 z-10 w-full" />
      <canvas ref={front} aria-hidden className={`${layer} z-40`} />
    </>
  );
}
