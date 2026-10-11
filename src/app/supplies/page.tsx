import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { equipment, supplyExamples } from "@/lib/site";

export const metadata: Metadata = {
  title: "Technical supplies",
  description:
    "Generating sets, pumps, safety materials and other equipment sourced from trusted manufacturers and delivered at competitive prices.",
};

export default function SuppliesPage() {
  return (
    <>
      <PageIntro title="General technical supplies" eyebrow="Sourcing and delivery">
        <p>
          Businesses don’t just need services. They need reliable equipment and tools to keep operations running. We
          source from trusted manufacturers and deliver at competitive prices.
        </p>
        <p className="inline-actions">
          <Link href="/contact?service=supplies" className="btn btn-primary">
            Request a supply quote
          </Link>
        </p>
      </PageIntro>

      <section className="section">
        <div className="container split">
          <Reveal className="split-head">
            <h2>Equipment we supply</h2>
            <p>
              Everyday essentials and specialised equipment, backed by our commitment to quality, affordability and
              compliance. This is a sample, not the full list.
            </p>
          </Reveal>
          <ul className="tick-list tick-list-columns">
            {equipment.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-mist">
        <div className="container">
          <Reveal className="section-head">
            <h2>Examples by client</h2>
            <p>Examples of what we supply to three kinds of client. Ask if what you need is not listed.</p>
          </Reveal>
          <div className="supply-table">
            {supplyExamples.map((example) => (
              <div key={example.client} className="supply-row">
                <h3>{example.client}</h3>
                <ul className="tick-list">
                  {example.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <dl className="reasons reasons-three">
            <div className="reason">
              <dt>Direct supplier networks</dt>
              <dd>Cost savings because we source directly rather than through layers of resellers.</dd>
            </div>
            <div className="reason">
              <dt>Quality assurance</dt>
              <dd>Reliable delivery, with equipment, spare parts and consumables checked for quality.</dd>
            </div>
            <div className="reason">
              <dt>One supplier</dt>
              <dd>The same company that treats your site can equip it.</dd>
            </div>
          </dl>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
