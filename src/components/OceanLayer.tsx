"use client";
import dynamic from "next/dynamic";

const Ocean = dynamic(() => import("@/ocean/Ocean"), { ssr: false });

export function OceanLayer() {
  return <Ocean />;
}
