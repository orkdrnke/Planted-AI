"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { usePlantStore } from "@/lib/store/plantsStore";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { TPlant } from "@/types/plant";
import { calculateTotalCost, formatCurrency } from "@/lib/plantTotals";

function PlantsTable() {
  const plants = usePlantStore((state) => state.plants);
  const newPlantId = usePlantStore((state) => state.newPlantId);
  const clearNewPlantId = usePlantStore((state) => state.clearNewPlantId);
  const highlightRef = useRef<HTMLTableRowElement | null>(null);
  const router = useRouter();

  const totalCost = calculateTotalCost(plants);

  const redirectToPlant = (id: string) => {
    router.push(`/myGarden/${id}`);
  };

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.classList.add("animate-highlight");
      const timeout = setTimeout(() => {
        highlightRef.current?.classList.remove("animate-highlight");
        clearNewPlantId();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [clearNewPlantId, newPlantId]);

  return (
    <Table className="caption-top m-auto">
      <TableCaption>Plants in my garden</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plants.map((plant) => (
          <TableRow
            key={plant.name}
            ref={plant.id === newPlantId ? highlightRef : null}
            onClick={() => redirectToPlant(plant.id!)}
            className="cursor-pointer hover:bg-muted"
          >
            <TableCell className="font-medium">
              <span className="flex items-center gap-2">
                {plant.name}
                <AiStatusIcon status={plant.aiStatus} />
              </span>
            </TableCell>
            <TableCell>{plant.type}</TableCell>
            <TableCell>{plant.price}</TableCell>
            <TableCell>{plant.size} cm</TableCell>
            <TableCell>{plant.dest}</TableCell>
            <TableCell className="text-right">{plant.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Total price</TableCell>
          <TableCell className="text-right">
            {formatCurrency(totalCost)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

function AiStatusIcon({ status }: { status: TPlant["aiStatus"] }) {
  if (status === "generating") {
    return (
      <Loader2
        className="size-4 animate-spin text-gray-500"
        aria-label="Generating care tips"
      />
    );
  }
  if (status === "error") {
    return (
      <AlertCircle
        className="size-4 text-red-600"
        aria-label="Care tips generation failed"
      />
    );
  }
  return null;
}

export default function myGarden() {
  return (
    <div className="flex flex-col p-4 text-3xl max-w-4xl mx-auto">
      <h1 className="text-4xl text-center font-[family-name:var(--font-geist-mono)]">
        My Garden
      </h1>
      <PlantsTable />
      <Link href="/addPlant" className="mt-4">
        <Button variant="default" className="cursor-pointer w-50">
          Add a Plant
        </Button>
      </Link>
    </div>
  );
}
