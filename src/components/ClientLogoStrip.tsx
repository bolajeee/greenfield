import Image from "next/image";
import { clients } from "@/lib/site";

/** Enough repeats that one group is wider than a large screen, so the loop never shows a gap. */
const REPEATS = 4;

/**
 * A small banner of client logos that rolls on a CSS animation, so it needs no
 * JavaScript. The second group is a copy for the loop and is hidden from
 * screen readers, which hear each client once.
 */
export function ClientLogoStrip() {
  const group = Array.from({ length: REPEATS }, () => clients).flat();

  return (
    <div className="logo-strip" role="group" aria-label="Our clients">
      <div className="logo-strip-track">
        {[false, true].map((isCopy) => (
          <div key={String(isCopy)} className="logo-strip-group" aria-hidden={isCopy || undefined}>
            {group.map((client, i) => (
              <Image
                key={`${client.name}-${i}`}
                src={client.logo}
                alt={isCopy || i >= clients.length ? "" : `${client.name} logo`}
                width={208}
                height={208}
                sizes="104px"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
