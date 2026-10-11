"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * reducedMotion="user" makes every motion animation respect the visitor's
 * operating-system "reduce motion" setting without each component checking it.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
