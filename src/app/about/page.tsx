import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Greenfield Golden Resources Ltd is a CAC-registered business services company specialising in fumigation, environmental services and technical supplies.",
};

const values = ["Integrity", "Safety", "Reliability", "Customer satisfaction", "Accountability"] as const;

export default function AboutPage() {
  return (
    <>
      <PageIntro title="A customer-first business services company" eyebrow="About Greenfield">
        <p>
          Greenfield is registered with the Corporate Affairs Commission. We specialise in fumigation, environmental
          services and general technical supplies that keep businesses compliant, safe and operational at lower costs.
        </p>
      </PageIntro>

      <section className="section">
        <div className="container about-grid">
          <figure className="field-photo about-photo">
            <Image
              src="/images/team-waterfront.jpg"
              alt="Two Greenfield technicians in branded green coveralls and white helmets standing at a waterfront"
              width={867}
              height={1152}
              sizes="(min-width: 900px) 420px, 100vw"
              priority
            />
          </figure>
          <div className="prose">
            <h2>How we work</h2>
            <p>
              Our approach combines professional expertise, trusted suppliers and a proven record of satisfied clients
              across multiple industries.
            </p>
            <p>
              Unlike traditional service providers, we also provide technical supplies, giving customers one company
              for both prevention and provision.
            </p>

            <h2>Vision</h2>
            <p>
              To be Nigeria’s most trusted provider of cost-efficient compliance services and technical supplies.
            </p>

            <h2>Mission</h2>
            <p>
              We protect and equip businesses with reliable fumigation services and high-quality supplies, reducing
              risks and costs while ensuring compliance.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-navy">
        <div className="container split">
          <Reveal className="split-head">
            <h2>Values</h2>
            <p>What clients can hold us to on every job.</p>
          </Reveal>
          <ul className="sector-list sector-list-light">
            {values.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <h2>Offices</h2>
          </Reveal>
          <dl className="reasons">
            {company.offices.map((office) => (
              <div key={office.city} className="reason">
                <dt>{office.label}</dt>
                <dd>
                  <address>{office.address}</address>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
