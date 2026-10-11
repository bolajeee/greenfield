"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/site";
import { Logo } from "./Logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Let Escape close the menu, as people expect from a disclosure.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />

        <nav className="nav-desktop" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/contact" className="btn btn-primary header-cta">
          Book a visit
        </Link>

        <button
          type="button"
          className="menu-button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      <nav id="mobile-nav" className="nav-mobile" aria-label="Main" hidden={!open}>
        <div className="container">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-mobile-link"
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-primary nav-mobile-cta">
            Book a visit
          </Link>
        </div>
      </nav>
    </header>
  );
}
