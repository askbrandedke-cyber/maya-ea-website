"use client";

import { m } from "framer-motion";

/**
 * Page transition on client-side navigation only.
 * The server render (and the first page a visitor loads) is never hidden: `initial` is false
 * unless we are in the browser AND this is not the first page of the visit. A module-level flag
 * alone is unsafe because static prerendering shares the module between pages.
 */
let clientFirstLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const isClient = typeof window !== "undefined";
  const animate = isClient && !clientFirstLoad;
  if (isClient) clientFirstLoad = false;
  return (
    <m.div initial={animate ? { opacity: 0, y: 10 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </m.div>
  );
}
