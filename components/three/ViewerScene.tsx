"use client";

import { CameraControls, ContactShadows, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import type CameraControlsImpl from "camera-controls";
import type { PackFormat } from "@/content/types";
import { PackModel } from "./PackModel";

export type ViewerApi = {
  rotate: (deg: number) => void;
  zoom: (delta: number) => void;
  reset: () => void;
  face: (side: "front" | "back") => void;
};

/** Lives inside <Canvas> so the CameraControls ref exists when the effect runs. */
function Controls({ autoRotate, onApi }: { autoRotate: boolean; onApi: (api: ViewerApi) => void }) {
  const cc = useRef<CameraControlsImpl>(null);
  const spinning = useRef(autoRotate);
  useEffect(() => {
    const c = cc.current;
    if (!c) return;
    // wheel never hijacks page scroll; one finger rotates, two fingers zoom
    c.mouseButtons.wheel = 0; // ACTION.NONE
    c.touches.two = 512; // ACTION.TOUCH_DOLLY
    c.touches.three = 0;
    c.minDistance = 2.2;
    c.maxDistance = 6.5;
    c.minPolarAngle = Math.PI * 0.2;
    c.maxPolarAngle = Math.PI * 0.62;
    c.saveState();
    const stop = () => (spinning.current = false);
    c.addEventListener("controlstart", stop);
    onApi({
      rotate: (deg) => (stop(), void c.rotate((deg * Math.PI) / 180, 0, true)),
      zoom: (d) => (stop(), void c.dolly(d, true)),
      reset: () => (stop(), void c.reset(true)),
      face: (side) => (stop(), void c.rotateAzimuthTo(side === "front" ? 0 : Math.PI, true)),
    });
    return () => c.removeEventListener("controlstart", stop);
  }, [onApi]);
  useFrame((_, dt) => {
    if (spinning.current) cc.current?.rotate(dt * 0.25, 0, false);
  });
  return <CameraControls ref={cc} makeDefault />;
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => onReady(), [onReady]);
  return null;
}

export default function ViewerScene({
  format,
  front,
  back,
  side,
  colour,
  preload,
  autoRotate,
  onApi,
  onReady,
}: {
  format: PackFormat;
  front: string;
  back: string;
  side: string;
  colour: string;
  preload: string[];
  autoRotate: boolean;
  onApi: (api: ViewerApi) => void;
  onReady: () => void;
}) {
  useEffect(() => {
    preload.forEach((u) => useTexture.preload(u));
  }, [preload]);

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0.25, 4.2], fov: 35 }} gl={{ antialias: true, alpha: true }} style={{ touchAction: "pan-y" }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[-3, 4, 5]} intensity={1.8} />
      <directionalLight position={[3, 1, -4]} intensity={0.9} color="#FFF4B0" />
      <Controls autoRotate={autoRotate} onApi={onApi} />
      <Suspense fallback={null}>
        <PackModel key={`${format}-${front}`} format={format} front={front} back={back} side={side} colour={colour} />
        <ContactShadows position={[0, -0.92, 0]} opacity={0.4} scale={5} blur={2.4} far={1.6} resolution={256} frames={1} />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
