import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { PageIntro } from "@/components/PageIntro";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a visit",
  description: "Book a fumigation visit or request a supply quote from our Abuja or Lagos office.",
};

export default function ContactPage() {
  return (
    <>
      <PageIntro title="Book a visit or request a quote" eyebrow="Start a conversation">
        <p>Tell us about the site and what you need. We call back to confirm scope and timing.</p>
      </PageIntro>

      <section className="section section-tight">
        <div className="container contact-grid">
          {/* BookingForm reads ?service= from the URL. Next.js requires a Suspense
              boundary around anything that uses useSearchParams on a static page. */}
          <Suspense fallback={<p className="form-hint">Loading the booking form…</p>}>
            <BookingForm />
          </Suspense>

          <aside className="contact-aside" aria-label="Contact details">
            <h2>Prefer to talk?</h2>
            <ul className="contact-list">
              {company.phones.map((phone) => (
                <li key={phone.href}>
                  <Phone size={18} aria-hidden="true" />
                  <a href={phone.href}>{phone.display}</a>
                </li>
              ))}
              <li>
                <Mail size={18} aria-hidden="true" />
                <a href={`mailto:${company.email}`} className="break-anywhere">
                  {company.email}
                </a>
              </li>
              {company.offices.map((office) => (
                <li key={office.city}>
                  <MapPin size={18} aria-hidden="true" />
                  <div>
                    <strong>{office.label}</strong>
                    <address>{office.address}</address>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
