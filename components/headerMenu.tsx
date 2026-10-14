"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HeaderMenu() {
  const pathname = usePathname();
  const isMyGardenPage = pathname === "/myGarden";

  return (
    <nav className="ml-auto flex items-center gap-2">
      {!isMyGardenPage && (
        <Link href="/myGarden">
          <Button variant="outline" className="cursor-pointer">
            My Garden
          </Button>
        </Link>
      )}
      <Link href="/addPlant">
        <Button variant="default" className="cursor-pointer w-50">
          Add a Plant
        </Button>
      </Link>
    </nav>
  );
}
