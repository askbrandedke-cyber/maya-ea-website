"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { ConceptTag } from "@/components/concept/ConceptTag";
import { heroPacks } from "@/lib/hero";
import { use3DGate, useFirstInteraction, useInView, useNarrow } from "@/lib/use-3d";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

/** Static poster positions mirror the 3D slots (percent of stage width). */
const POSTER = [
  { left: 7, w: 15, rot: 10, top: 38, z: 1 },
  { left: 22, w: 17, rot: 5, top: 34, z: 2 },
  { left: 40, w: 20, rot: 0, top: 30, z: 3 },
  { left: 61, w: 17, rot: -5, top: 34, z: 2 },
  { left: 78, w: 15, rot: -10, top: 38, z: 1 },
];
/** Phones show the middle three packs, larger. */
const POSTER_SM: (null | { left: number; w: number; top: number })[] = [
  null,
  { left: 4, w: 29, top: 14 },
  { left: 35, w: 31, top: 8 },
  { left: 68, w: 29, top: 14 },
  null,
];

export function HeroStage() {
  const stage = useRef<HTMLDivElement>(null);
  const gate = use3DGate();
  const [forced, setForced] = useState(false);
  const interacted = useFirstInteraction(gate === "ok");
  const inView = useInView(stage, "100px");
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const onReady = useCallback(() => setReady(true), []);
  const onHover = useCallback((i: number | null) => setHover(i), []);
  const narrow = useNarrow();
  const packs = narrow ? heroPacks.slice(1, 4) : heroPacks;

  const want3D = (gate === "ok" && interacted) || forced;
  const canOffer = gate === "save-data" || gate === "low-power" || gate === "reduced-motion";

  return (
    <div ref={stage} className="relative aspect-[5/4] w-full sm:aspect-[16/10] lg:aspect-[4/3]">
      {/* 1 · Static poster (always rendered first; also the fallback) */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
        aria-hidden={ready}
      >
        <ul className="relative h-full w-full" aria-label="Concept packs in the hero line-up">
          {heroPacks.map((p, i) => {
            const s = POSTER[i];
            const m = POSTER_SM[i];
            const vars = {
              "--l": `${s.left}%`, "--w": `${s.w}%`, "--t": `${s.top}%`,
              "--lm": `${m?.left ?? 0}%`, "--wm": `${m?.w ?? 0}%`, "--tm": `${m?.top ?? 0}%`,
              zIndex: s.z,
            } as React.CSSProperties;
            return (
              <li
                key={p.slug}
                className={`absolute left-[var(--lm)] top-[var(--tm)] w-[var(--wm)] sm:left-[var(--l)] sm:top-[var(--t)] sm:w-[var(--w)] ${m ? "" : "hidden sm:block"}`}
                style={vars}
              >
                <Link href={p.href} className="block">
                  <Image
                    src={p.front}
                    alt={`${p.name} (${p.category}): concept pack front`}
                    width={384}
                    height={538}
                    sizes="(min-width: 1024px) 12vw, 20vw"
                    loading={i === 2 ? "eager" : "lazy"}
                    className="h-auto w-full rounded-[6px] shadow-[0_24px_40px_-12px_rgba(0,0,0,.55)]"
                    style={{ transform: `perspective(900px) rotateY(${s.rot * 2}deg)` }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 2 · 3D line-up, mounted only when allowed + interacted, paused off-screen */}
      {want3D && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
          <HeroScene key={narrow ? "n" : "w"} packs={packs} narrow={narrow} active={inView} onReady={onReady} onHover={onHover} />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 px-1">
        <ConceptTag />
        <p aria-live="polite" className="min-h-6 text-xs font-medium text-white/75">
          {ready && hover !== null
            ? `${packs[hover].name} · ${packs[hover].category}, tap to open`
            : ready
              ? "Move or drag to turn the packs"
              : ""}
        </p>
        {!want3D && canOffer && (
          <button
            type="button"
            onClick={() => setForced(true)}
            className="min-h-11 rounded-full px-4 text-xs font-semibold text-white ring-1 ring-white/30 hover:bg-white/10"
          >
            View in 3D
          </button>
        )}
      </div>
    </div>
  );
}
