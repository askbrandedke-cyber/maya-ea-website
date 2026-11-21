"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import type { HeroPack } from "@/lib/hero";
import { PackModel } from "./PackModel";

/** Positions are tuned for a 5-pack arc; the centre pack is largest and nearest. */
const SLOTS = [
  { x: -2.3, z: -0.9, s: 0.86, ry: 0.42 },
  { x: -1.18, z: -0.25, s: 0.92, ry: 0.22 },
  { x: 0, z: 0.25, s: 1.04, ry: 0 },
  { x: 1.18, z: -0.25, s: 0.92, ry: -0.22 },
  { x: 2.3, z: -0.9, s: 0.86, ry: -0.42 },
];

const SLOTS_NARROW = [
  { x: -1.22, z: -0.35, s: 0.95, ry: 0.28 },
  { x: 0, z: 0.25, s: 1.05, ry: 0 },
  { x: 1.22, z: -0.35, s: 0.95, ry: -0.28 },
];

function Lineup({ packs, narrow, onHover }: { packs: HeroPack[]; narrow: boolean; onHover: (i: number | null) => void }) {
  const slots = narrow ? SLOTS_NARROW : SLOTS;
  const group = useRef<THREE.Group>(null);
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);
  const lifts = useRef<(THREE.Group | null)[]>([]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    // follow pointer / touch with easing
    const k = 1 - Math.exp(-dt * 3);
    g.rotation.y += (state.pointer.x * 0.26 - g.rotation.y) * k;
    g.rotation.x += (-state.pointer.y * 0.08 - g.rotation.x) * k;
    lifts.current.forEach((l, i) => {
      if (!l) return;
      const target = hovered === i ? 0.16 : 0;
      l.position.y += (target - l.position.y) * k * 2;
      const sc = hovered === i ? 1.05 : 1;
      l.scale.setScalar(l.scale.x + (sc - l.scale.x) * k * 2);
    });
  });

  return (
    <group ref={group} position={[0, 0.05, 0]}>
      {packs.map((p, i) => {
        const s = slots[i];
        return (
          <Float key={p.slug} speed={1.2 + i * 0.15} rotationIntensity={0.25} floatIntensity={0.35} floatingRange={[-0.04, 0.06]}>
            <group position={[s.x, 0, s.z]} rotation={[0, s.ry, 0]} scale={s.s}>
              <group
                ref={(el) => {
                  lifts.current[i] = el;
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHovered(i);
                  onHover(i);
                  document.body.style.cursor = "pointer";
                }}
                onPointerOut={() => {
                  setHovered(null);
                  onHover(null);
                  document.body.style.cursor = "";
                }}
                onClick={() => router.push(p.href)}
              >
                <PackModel format={p.format} front={p.front} back={p.back} side={p.side} colour={p.colour} />
              </group>
            </group>
          </Float>
        );
      })}
    </group>
  );
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => onReady(), [onReady]);
  return null;
}

export default function HeroScene({
  packs,
  narrow = false,
  active,
  onReady,
  onHover,
}: {
  packs: HeroPack[];
  narrow?: boolean;
  active: boolean;
  onReady: () => void;
  onHover: (i: number | null) => void;
}) {
  useEffect(() => () => void (document.body.style.cursor = ""), []);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.3, narrow ? 5.9 : 7.8], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "default" }}
      style={{ touchAction: "pan-y" }}
      aria-hidden
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[-3, 5, 5]} intensity={1.9} />
      <directionalLight position={[4, 2, -3]} intensity={0.8} color="#FFF4B0" />
      <Suspense fallback={null}>
        <Lineup packs={packs} narrow={narrow} onHover={onHover} />
        <ContactShadows position={[0, -1.02, 0]} opacity={0.45} scale={9} blur={2.6} far={2.2} resolution={256} frames={1} />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
