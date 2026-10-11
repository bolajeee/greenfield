import Link from "next/link";
import { ClientLogoStrip } from "@/components/ClientLogoStrip";
import { CtaBand } from "@/components/CtaBand";
import { FieldGrid } from "@/components/FieldGrid";
import { Reveal } from "@/components/Reveal";
import { TreatmentHero } from "@/components/TreatmentHero";
import { equipment, feedback, reasons, sectors } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <TreatmentHero />

      <section className="service-rail" aria-label="Greenfield service coverage">
        <div className="container service-rail-inner">
          <p><span>01</span> Fumigation &amp; pest control</p>
          <p><span>02</span> Technical supplies</p>
          <p><span>03</span> Environmental services</p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <Reveal className="split-head">
            <h2>Who we work for</h2>
            <p>
              Our services are designed for businesses and institutions that cannot afford risks, downtime or
              compliance failures.
            </p>
          </Reveal>
          <ul className="sector-list">
            {sectors.map((sector) => (
              <li key={sector}>{sector}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-mist">
        <div className="container">
          <Reveal className="section-head">
            <h2>Our crews at work</h2>
            <p>Buildings, grounds, vehicles and boats, treated by our own technicians in full protective gear.</p>
          </Reveal>
          <FieldGrid />
        </div>
      </section>

      <section className="section section-navy">
        <div className="container split">
          <Reveal className="split-head">
            <h2>Prevention and provision from one company</h2>
            <p>
              Unlike traditional service providers, we also source and deliver equipment, spare parts and
              consumables through direct supplier networks, with quality assurance on every delivery.
            </p>
            <Link href="/supplies" className="btn btn-leaf">
              See technical supplies
            </Link>
          </Reveal>
          <ul className="tick-list tick-list-columns">
            {equipment.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <h2>Why businesses choose Greenfield</h2>
          </Reveal>
          <dl className="reasons">
            {reasons.map((reason) => (
              <div key={reason.title} className="reason">
                <dt>{reason.title}</dt>
                <dd>{reason.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section-mist">
        <div className="container">
          <Reveal className="section-head">
            <h2>What clients tell us</h2>
          </Reveal>
          <div className="quotes">
            {feedback.map((quote) => (
              <blockquote key={quote} className="quote">
                <p>{quote}</p>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight logo-section" aria-label="Clients">
        <ClientLogoStrip />
      </section>

      <CtaBand />
    </>
  );
}
