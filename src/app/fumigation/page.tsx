import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { fieldPhotos, supportingServices } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fumigation and pest control",
  description:
    "Safe, compliant and certified fumigation that protects goods, facilities and staff, scheduled for minimal downtime.",
};

const promises = [
  {
    title: "Safe, compliant and certified",
    body: "Every treatment follows safe, compliant and certified processes, so your next inspection is not a risk.",
  },
  {
    title: "Protection for goods, facilities and staff",
    body: "We treat the stock you hold and the building around it, with the people who work there in mind.",
  },
  {
    title: "Flexible scheduling, minimal downtime",
    body: "We work around your operating hours so the site is back in use as soon as possible.",
  },
] as const;

const steps = [
  {
    title: "Tell us about the site",
    body: "Send the booking form or call either office with the type of premises, the location and a date that suits you.",
  },
  {
    title: "We confirm scope and timing",
    body: "We call back to agree what needs treating and a time that keeps disruption low.",
  },
  {
    title: "Our crew treats the site",
    body: "Technicians arrive in protective gear with their own equipment and carry out the treatment.",
  },
] as const;

export default function FumigationPage() {
  // Four photos that show the range of places we treat.
  const treated = [fieldPhotos[2], fieldPhotos[0], fieldPhotos[1], fieldPhotos[3]];

  return (
    <>
      <PageIntro title="Fumigation and pest control" eyebrow="Commercial pest management">
        <p>
          Safe, compliant and certified treatment for businesses and institutions that cannot afford risks, downtime
          or compliance failures.
        </p>
        <p className="inline-actions">
          <Link href="/contact?service=fumigation" className="btn btn-primary">
            Book a fumigation visit
          </Link>
        </p>
      </PageIntro>

      <section className="section">
        <div className="container">
          <dl className="reasons reasons-three">
            {promises.map((promise) => (
              <div key={promise.title} className="reason">
                <dt>{promise.title}</dt>
                <dd>{promise.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section-mist">
        <div className="container">
          <Reveal className="section-head">
            <h2>Where we work</h2>
            <p>Offices and interiors, estates and grounds, vehicles and boats.</p>
          </Reveal>
          <div className="photo-row">
            {treated.map((photo) => (
              <figure key={photo.src} className="field-photo">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 900px) 270px, 50vw"
                />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <Reveal className="split-head">
            <h2>How a booking works</h2>
            <p>Three steps from first contact to a treated site.</p>
          </Reveal>
          <ol className="steps">
            {steps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-mist">
        <div className="container">
          <Reveal className="section-head">
            <h2>Supporting services</h2>
            <p>Work we carry out alongside fumigation, often on the same sites.</p>
          </Reveal>
          <ul className="support-list">
            {supportingServices.map((service) => (
              <li key={service.title} className="support-item">
                <h3>{service.title}</h3>
                {service.image ? (
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    width={service.image.width}
                    height={service.image.height}
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
