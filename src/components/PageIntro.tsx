import type { ReactNode } from "react";

/** The opening block shared by every inner page. */
export function PageIntro({
  title,
  children,
  eyebrow = "Greenfield services",
}: {
  title: string;
  children: ReactNode;
  eyebrow?: string;
}) {
  return (
    <section className="page-intro">
      <div className="container page-intro-inner">
        <div className="page-intro-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <div className="page-intro-lede">{children}</div>
        </div>
        <div className="page-intro-mark" aria-hidden="true">
          <span>G</span>
          <small>Safe sites<br />Stronger operations</small>
        </div>
      </div>
    </section>
  );
}
