"use client";

import { m, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Scroll reveal that never hides server-rendered content:
 * it only "arms" (hides, then fades in on scroll) for elements that start below the fold,
 * so first paint, LCP and no-JS visitors are unaffected.
 */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (el && el.getBoundingClientRect().top > window.innerHeight) setArmed(true);
  }, []);
  return (
    <m.div
      ref={ref}
      className={className}
      initial={false}
      animate={!armed ? undefined : inView ? { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } } : { opacity: 0, y: 24, transition: { duration: 0 } }}
    >
      {children}
    </m.div>
  );
}
