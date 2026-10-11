import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";

export default function NotFound() {
  return (
    <PageIntro title="That page isn’t here.">
      <p>The link may be old or mistyped. The pages below cover everything on this site.</p>
      <p className="inline-actions">
        <Link href="/" className="btn btn-primary">
          Go to the home page
        </Link>
        <Link href="/contact" className="btn btn-ghost">
          Book a visit
        </Link>
      </p>
    </PageIntro>
  );
}
