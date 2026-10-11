import Link from "next/link";
import { Phone } from "lucide-react";
import { company } from "@/lib/site";

export function CtaBand() {
  const phone = company.phones[0];
  return (
    <section className="cta-band">
      <div className="container cta-band-inner">
        <div>
          <p className="eyebrow eyebrow-light">Ready when your site is</p>
          <h2>Let us help you reduce costs and stay compliant this quarter.</h2>
        </div>
        <div className="cta-band-actions">
          <Link href="/contact" className="btn btn-leaf">
            Book a visit
          </Link>
          <a href={phone.href} className="btn btn-ghost-light">
            <Phone size={18} aria-hidden="true" />
            Call {phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
