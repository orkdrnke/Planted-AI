import Link from "next/link";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uiStrings } from "@/lib/uiStrings";

export function EmptyState() {
  const { emptyState } = uiStrings;

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-8 text-center">
      <Sprout aria-hidden="true" className="size-10 text-green-700" />
      <h2 className="text-xl font-semibold">{emptyState.title}</h2>
      <p className="text-base text-gray-600">{emptyState.description}</p>
      <Button asChild size="lg" className="mt-2">
        <Link href="/addPlant">{emptyState.action}</Link>
      </Button>
    </div>
  );
}
