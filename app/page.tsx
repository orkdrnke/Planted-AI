import Image from "next/image";
import Link from "next/link";
import { uiStrings } from "@/lib/uiStrings";

const { landing } = uiStrings;

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl block text-center">
          {landing.title}
        </h1>
        <ol className="list-inside list-decimal text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            {landing.getStartedBefore}{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              <Link href="/myGarden">{landing.getStartedLink}</Link>
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">{landing.aiTips}</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/myGarden"
          >
            {landing.myGarden}
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href=""
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt={landing.vercelAlt}
              width={20}
              height={20}
            />
            {landing.searchPlants}
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href=""
          >
            {landing.takePhoto}
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt=""
            width={16}
            height={16}
          />
          {landing.about}
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href=""
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt=""
            width={16}
            height={16}
          />
          {landing.calendar}
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href=""
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt=""
            width={16}
            height={16}
          />
          {landing.notifications}
        </Link>
      </footer>
    </div>
  );
}
