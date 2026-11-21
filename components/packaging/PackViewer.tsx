"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PackFormat } from "@/content/types";
import { ConceptTag } from "@/components/concept/ConceptTag";
import { formatLabel } from "@/lib/pack-files";
import { use3DGate, useFirstInteraction, useInView } from "@/lib/use-3d";
import type { ViewerApi } from "@/components/three/ViewerScene";

const ViewerScene = dynamic(() => import("@/components/three/ViewerScene"), { ssr: false });

export interface ViewerSize {
  label: string;
  carton?: string;
  format: PackFormat;
  front: string;
  frontSm: string;
}

const FORMATS: PackFormat[] = ["sack", "box", "pouch", "tub", "bottle", "sleeve"];

/**
 * 3D concept-pack viewer: drag to rotate, pinch or +/− to zoom, switch size, format and face.
 * Static label image renders first; WebGL loads only when in view and the device allows it.
 */
export function PackViewer({ name, colour, sizes, back, backSm, side }: { name: string; colour: string; sizes: ViewerSize[]; back: string; backSm: string; side: string }) {
  const box = useRef<HTMLDivElement>(null);
  const gate = use3DGate();
  const inView = useInView(box, "200px");
  const [forced, setForced] = useState(false);
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [formatOverride, setFormatOverride] = useState<PackFormat | null>(null);
  const [face, setFace] = useState<"front" | "back">("front");
  const api = useRef<ViewerApi | null>(null);

  // arm 3D once the viewer is in view AND the visitor has interacted (scroll, pointer, key),
  // so the ~180 KB three.js bundle never competes with first paint
  const interacted = useFirstInteraction(gate === "ok");
  useEffect(() => {
    if (!armed && ((inView && gate === "ok" && interacted) || forced)) setArmed(true);
  }, [inView, gate, interacted, forced, armed]);

  const size = sizes[sizeIdx];
  const format = formatOverride ?? size.format;
  const onApi = useCallback((a: ViewerApi) => (api.current = a), []);
  const onReady = useCallback(() => setReady(true), []);
  const show3D = armed && ready;
  const reduce = gate === "reduced-motion";

  const setSide = (s: "front" | "back") => {
    setFace(s);
    api.current?.face(s);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!api.current) return;
    const map: Record<string, () => void> = {
      ArrowLeft: () => api.current!.rotate(-20),
      ArrowRight: () => api.current!.rotate(20),
      ArrowUp: () => api.current!.zoom(0.5),
      ArrowDown: () => api.current!.zoom(-0.5),
      Home: () => api.current!.reset(),
    };
    if (map[e.key]) {
      e.preventDefault();
      map[e.key]();
    }
  };

  return (
    <div>
      <figure className="relative">
        <div
          ref={box}
          tabIndex={show3D ? 0 : -1}
          onKeyDown={onKey}
          role={show3D ? "application" : undefined}
          aria-roledescription={show3D ? "3D pack viewer" : undefined}
          aria-label={show3D ? `${name} concept pack in 3D. Arrow keys rotate and zoom, Home resets.` : undefined}
          className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_50%_35%,#ffffff,#E9E2D2)] ring-1 ring-line"
        >
          {/* Static fallback / poster */}
          <div className={`absolute inset-0 flex items-center justify-center p-[12%] transition-opacity duration-500 ${show3D ? "opacity-0" : "opacity-100"}`} aria-hidden={show3D}>
            <Image
              src={face === "front" ? size.front : back}
              alt={`${name}, ${size.label}: concept pack ${face} panel`}
              width={1024}
              height={1434}
              sizes="(min-width: 1024px) 40vw, 80vw"
              priority
              className="h-full w-auto rounded-md object-contain shadow-[0_30px_50px_-20px_rgba(13,32,54,.5)]"
            />
          </div>
          {armed && (
            <div className={`absolute inset-0 transition-opacity duration-500 ${show3D ? "opacity-100" : "opacity-0"}`}>
              <ViewerScene
                format={format}
                front={size.front}
                back={back}
                side={side}
                colour={colour}
                preload={sizes.map((s) => s.front)}
                autoRotate={!reduce}
                onApi={onApi}
                onReady={onReady}
              />
            </div>
          )}
          <figcaption className="pointer-events-none absolute left-3 top-3 z-10">
            <ConceptTag />
          </figcaption>
          {show3D && (
            <div className="absolute bottom-3 right-3 z-10 flex gap-1.5 rounded-full bg-white/90 p-1 shadow ring-1 ring-line">
              {[
                { l: "Rotate left", i: "M15 6 9 12l6 6", f: () => api.current?.rotate(-30) },
                { l: "Rotate right", i: "m9 6 6 6-6 6", f: () => api.current?.rotate(30) },
                { l: "Zoom in", i: "M12 6v12M6 12h12", f: () => api.current?.zoom(0.6) },
                { l: "Zoom out", i: "M6 12h12", f: () => api.current?.zoom(-0.6) },
                { l: "Reset view", i: "M4 12a8 8 0 1 0 3-6.2M4 4v4h4", f: () => api.current?.reset() },
              ].map((b) => (
                <button key={b.l} type="button" onClick={b.f} aria-label={b.l} title={b.l} className="flex size-11 items-center justify-center rounded-full text-ink hover:bg-cream">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={b.i} />
                  </svg>
                </button>
              ))}
            </div>
          )}
          {!armed && gate !== "ok" && gate !== "pending" && gate !== "no-webgl" && (
            <button type="button" onClick={() => setForced(true)} className="absolute bottom-3 right-3 z-10 min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-white">
              Load 3D viewer
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-ink/75">
          {show3D ? "Drag to rotate · pinch or use + / − to zoom · arrow keys when focused" : armed ? "Loading 3D…" : "Concept pack artwork (3D loads when in view)"}
        </p>
      </figure>

      {/* Controls */}
      <div className="mt-4 grid gap-4">
        {sizes.length > 1 && (
          <fieldset>
            <legend className="text-sm font-semibold">Pack size</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((s, i) => (
                <ChoiceButton key={s.label + i} active={i === sizeIdx} onClick={() => (setSizeIdx(i), setFormatOverride(null))}>
                  {s.label}
                  {s.carton ? <span className="text-xs opacity-70"> · {s.carton}</span> : null}
                </ChoiceButton>
              ))}
            </div>
          </fieldset>
        )}
        <fieldset>
          <legend className="text-sm font-semibold">
            Format <span className="font-normal text-ink/75">(preview the label on other pack types)</span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <ChoiceButton key={f} active={f === format} onClick={() => setFormatOverride(f === size.format ? null : f)}>
                {formatLabel[f]}
                {f === size.format ? <span className="text-xs opacity-70"> · proposed</span> : null}
              </ChoiceButton>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-semibold">Panel</legend>
          <div className="mt-2 flex gap-2">
            <ChoiceButton active={face === "front"} onClick={() => setSide("front")}>
              Front
            </ChoiceButton>
            <ChoiceButton active={face === "back"} onClick={() => setSide("back")}>
              Back
            </ChoiceButton>
          </div>
        </fieldset>
      </div>
      <link rel="prefetch" href={backSm} />
    </div>
  );
}

function ChoiceButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-11 rounded-full px-4 text-sm font-semibold ring-1 transition ${active ? "bg-ink text-white ring-ink" : "bg-white text-ink ring-line hover:ring-navy"}`}
    >
      {children}
    </button>
  );
}
