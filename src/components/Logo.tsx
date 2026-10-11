import Image from "next/image";
import Link from "next/link";
import { company } from "@/lib/site";

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label={`${company.name}, home`}>
      <Image src="/images/greenfield-mark.png" alt="" width={40} height={40} priority />
      <span className="logo-text" aria-hidden="true">
        <span className="logo-name">Greenfield</span>
        <span className="logo-sub">Golden Resources Ltd</span>
      </span>
    </Link>
  );
}
