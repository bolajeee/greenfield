"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ChevronDown, MapPin, Phone, ShieldCheck } from "lucide-react";
import { company } from "@/lib/site";

/**
 * three.js is large. Loading the scene with next/dynamic keeps it out of the
 * first JavaScript bundle, and ssr:false skips it on the server, where there
 * is no WebGL to draw with anyway.
 */
const TreatmentScene = dynamic(() => import("./TreatmentScene"), { ssr: false });

/**
 * Each beat is on screen for one slice of the scroll: [fade in start, fully in,
 * fully in until, faded out]. The numbers are fractions of the hero's scroll
 * length and line up with the moment the mist reaches that part of the 3D site.
 */
const beats = [
  {
    range: [0.2, 0.26, 0.4, 0.46],
    title: "Stock and storage",
    body: "Treatment that protects the goods you hold, the facility around them and the staff who work there.",
  },
  {
    range: [0.46, 0.52, 0.66, 0.72],
    title: "Offices and staff areas",
    body: "Flexible scheduling around your working hours, so the job is done with minimal downtime.",
  },
  {
    range: [0.72, 0.78, 0.94, 1],
    title: "Tanks and yard",
    body: "Safe, compliant and certified processes across the whole site, with tank cleaning and calibration from the same team.",
    cta: true,
  },
] as const;

/** If WebGL fails on a device, show the photo instead of a broken box. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Beat({
  progress,
  beat,
}: {
  progress: MotionValue<number>;
  beat: (typeof beats)[number];
}) {
  const opacity = useTransform(progress, [...beat.range], [0, 1, 1, 0]);
  const y = useTransform(progress, [beat.range[0], beat.range[1]], [16, 0]);
  // A fully faded beat is also hidden from keyboard and screen-reader focus.
  const visibility = useTransform(opacity, (value) => (value < 0.02 ? "hidden" : "visible"));

  return (
    <motion.li className="hero-beat" style={{ opacity, y, visibility }}>
      <h2>{beat.title}</h2>
      <p>{beat.body}</p>
      {"cta" in beat ? (
        <Link href="/contact" className="btn btn-primary">
          Book a fumigation visit
        </Link>
      ) : null}
    </motion.li>
  );
}

export function TreatmentHero() {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const stageInView = useInView(stageRef, { amount: 0.05 });
  const [show3d, setShow3d] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);

  // Decide on the client, after hydration, so server and client HTML match.
  useEffect(() => {
    setShow3d(!reduce);
  }, [reduce]);

  // 0 at the top of the tall track, 1 when its bottom edge reaches the bottom of the screen.
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  const introOpacity = useTransform(scrollYProgress, [0, 0.12, 0.2], [1, 1, 0]);
  const introVisibility = useTransform(introOpacity, (value) => (value < 0.02 ? "hidden" : "visible"));
  const phone = company.phones[0];

  return (
    <section ref={trackRef} className="hero" aria-label="Fumigation and pest control">
      <div ref={stageRef} className="hero-stage">
        <div className="container hero-layout">
          <div className="hero-copy">
            <motion.div className="hero-intro" style={{ opacity: introOpacity, visibility: introVisibility }}>
              <p className="eyebrow">Commercial protection · Abuja + Lagos</p>
              <h1>Fumigation for sites that can’t afford downtime or a failed inspection.</h1>
              <p className="hero-lede">
                We treat offices, estates, hotels, schools and hospitals from our Abuja and Lagos offices, and supply
                the equipment that keeps them running.
              </p>
              <div className="hero-actions">
                <Link href="/contact" className="btn btn-primary">
                  Book a fumigation visit
                </Link>
                <a href={phone.href} className="btn btn-ghost">
                  <Phone size={18} aria-hidden="true" />
                  {phone.display}
                </a>
              </div>
              <p className="hero-cue" aria-hidden="true">
                <ChevronDown size={18} />
                Scroll to follow a treatment across a site
              </p>
              <ul className="hero-proof" aria-label="Service assurances">
                <li><ShieldCheck size={17} aria-hidden="true" /> Safe, compliant treatment</li>
                <li><MapPin size={17} aria-hidden="true" /> Abuja and Lagos teams</li>
              </ul>
            </motion.div>

            <ol className="hero-beats">
              {beats.map((beat) => (
                <Beat key={beat.title} progress={scrollYProgress} beat={beat} />
              ))}
            </ol>
          </div>

          <div className={sceneFailed ? "hero-visual hero-visual-photo" : "hero-visual"}>
            <div className="scene-shell">
              <div className="scene-topline" aria-hidden="true">
                <span><i /> Treatment in progress</span>
                <span>GF / 01</span>
              </div>
              {show3d && !sceneFailed ? (
                <SceneBoundary onError={() => setSceneFailed(true)}>
                  <TreatmentScene progress={scrollYProgress} active={stageInView} />
                </SceneBoundary>
              ) : null}
              {/* Shown instead of the 3D scene for reduced-motion visitors and when WebGL is unavailable. */}
              <Image
                className="hero-photo"
                src="/images/mist-blower-crew.jpg"
                alt="Greenfield technicians carrying backpack mist blowers across a lawn"
                width={720}
                height={1124}
                sizes="(min-width: 900px) 420px, 80vw"
              />
              <div className="scene-legend" aria-hidden="true">
                <span><i className="legend-before" /> Untreated</span>
                <span><i className="legend-after" /> Protected</span>
              </div>
            </div>
          </div>
        </div>

        <motion.div className="hero-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      </div>
    </section>
  );
}
