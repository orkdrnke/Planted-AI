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

function PlantsTable() {
  const plants = usePlantStore((state) => state.plants);
  const store = usePlantStore();
  const newPlantId = usePlantStore((state) => state.newPlantId);
  const clearNewPlantId = usePlantStore((state) => state.clearNewPlantId);
  const highlightRef = useRef<HTMLTableRowElement | null>(null);
  console.log("🚀 ~ PlantsTable ~ store:", store);

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.classList.add("animate-highlight");
      const timeout = setTimeout(() => {
        highlightRef.current?.classList.remove("animate-highlight");
        clearNewPlantId();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [newPlantId]);

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
          >
            <TableCell className="font-medium">{plant.name}</TableCell>
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
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
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
