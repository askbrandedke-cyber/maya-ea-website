"use client";

import { useEffect, useState } from "react";

export type Gate = "pending" | "ok" | "reduced-motion" | "save-data" | "low-power" | "no-webgl";

/**
 * Decides whether a device should get WebGL (PERFORMANCE RULES in the brief):
 * no 3D for reduced motion, Save-Data, low-power devices or missing WebGL2.
 * The caller always renders a static fallback first.
 */
export function use3DGate(): Gate {
  const [gate, setGate] = useState<Gate>("pending");
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setGate("reduced-motion");
    if (nav.connection?.saveData || /(^|-)2g$/.test(nav.connection?.effectiveType ?? "")) return setGate("save-data");
    if ((nav.deviceMemory ?? 8) < 4 || (nav.hardwareConcurrency ?? 8) < 4) return setGate("low-power");
    try {
      const c = document.createElement("canvas");
      if (!c.getContext("webgl2")) return setGate("no-webgl");
    } catch {
      return setGate("no-webgl");
    }
    setGate("ok");
  }, []);
  return gate;
}

/**
 * Resolves true after the first user interaction (pointer, touch, key, scroll).
 * Deferring the ~170 KB (gz) three.js bundle until then keeps it off the critical path.
 */
export function useFirstInteraction(enabled: boolean) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!enabled || done) return;
    const evts = ["pointermove", "pointerdown", "touchstart", "keydown", "scroll", "wheel"] as const;
    const go = () => setDone(true);
    evts.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    return () => evts.forEach((e) => window.removeEventListener(e, go));
  }, [enabled, done]);
  return done;
}

export function useInView<T extends Element>(ref: React.RefObject<T | null>, rootMargin = "0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/** True below the `sm` breakpoint (640px). */
export function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return narrow;
}
