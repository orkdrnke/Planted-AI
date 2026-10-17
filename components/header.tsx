import Image from "next/image";
import Link from "next/link";
import HeaderMenu from "@/components/headerMenu";
import { uiStrings } from "@/lib/uiStrings";

export default function Header() {
  return (
    <header className=" text-orange-800 text-2xl font-[family-name:var(--font-geist-mono)] p-4 flex items-center">
      <Link href="/" className="flex gap-1">
        <Image
          alt={uiStrings.header.logoAlt}
          src="/icons/monstera.svg"
          width={20}
          height={20}
          className="bg-orange-900 fill-amber-50 mr-2"
        />
        Planted AI
      </Link>
      <HeaderMenu />
    </header>
  );
}
