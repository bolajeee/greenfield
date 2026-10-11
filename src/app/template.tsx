"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Next.js re-mounts template.tsx on every navigation (layout.tsx is kept).
 * That makes it the right place for a page transition: each new page fades
 * in while the header and footer stay still.
 *
 * Only opacity is animated. A transform here would turn this wrapper into the
 * containing block for the hero's sticky stage while it runs.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
