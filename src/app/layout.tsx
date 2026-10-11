import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/components/Providers";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { company } from "@/lib/site";
import "./globals.css";

// One variable font file covers every weight and width the site uses.
// Asking for the "wdth" axis lets headings run wider than body text.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: {
    default: `${company.name} | Fumigation and technical supplies`,
    template: `%s | ${company.name}`,
  },
  description:
    "Fumigation, pest control and general technical supplies for businesses and institutions, from offices in Abuja and Lagos.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
