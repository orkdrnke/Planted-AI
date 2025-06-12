import Image from "next/image";

export default function Header() {
  return (
    <header className=" text-orange-800 text-2xl font-[family-name:var(--font-geist-mono)] p-4 flex">
      <Image
        alt="logo"
        src="/icons/monstera.svg"
        width={20}
        height={20}
        className="bg-orange-900 fill-amber-50 mr-2"
      />
      Planted AI
    </header>
  );
}
