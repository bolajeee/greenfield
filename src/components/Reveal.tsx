"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Fades content up once, the first time it scrolls into view.
 * Used on section headings only: if everything on a page animates,
 * nothing reads as important.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
