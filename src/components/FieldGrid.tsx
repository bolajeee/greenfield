"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { fieldPhotos } from "@/lib/site";

/**
 * Field photos in three columns. The middle column drifts against the page
 * scroll, so the grid has depth without any photo being hidden or cropped away.
 */
export function FieldGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // 0 when the grid's top edge reaches the bottom of the screen,
  // 1 when its bottom edge leaves the top.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [36, -36]);

  // Deal the photos into columns so each column can move on its own.
  const columns = [0, 1, 2].map((column) => fieldPhotos.filter((_, index) => index % 3 === column));

  return (
    <div ref={ref} className="field-grid">
      {columns.map((photos, column) => (
        <motion.div key={column} className="field-column" style={column === 1 ? { y: drift } : undefined}>
          {photos.map((photo) => (
            <figure key={photo.src} className="field-photo">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 900px) 360px, 50vw"
              />
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
