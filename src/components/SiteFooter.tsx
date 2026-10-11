import Link from "next/link";
import { company, navLinks } from "@/lib/site";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>{company.tagline}</p>
          <p className="footer-note">Registered with the Corporate Affairs Commission.</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="footer-heading">Pages</h2>
          <ul className="footer-list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="footer-heading">Offices</h2>
          <ul className="footer-list">
            {company.offices.map((office) => (
              <li key={office.city}>
                <span className="footer-label">{office.label}</span>
                <address>{office.address}</address>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="footer-heading">Talk to us</h2>
          <ul className="footer-list">
            {company.phones.map((phone) => (
              <li key={phone.href}>
                <a href={phone.href}>{phone.display}</a>
              </li>
            ))}
            <li>
              <a href={`mailto:${company.email}`} className="break-anywhere">
                {company.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-base">
        <p>
          © {new Date().getFullYear()} {company.name}
        </p>
      </div>
    </footer>
  );
}
