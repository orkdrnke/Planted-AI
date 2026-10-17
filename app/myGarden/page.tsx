"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CollectionStatus } from "@/components/collectionStatus";
import { EmptyState } from "@/components/emptyState";
import { PlantListItem, plantListColumns } from "@/components/plantListItem";
import { usePlantStore } from "@/lib/store/plantsStore";
import { uiStrings } from "@/lib/uiStrings";
import { cn } from "@/lib/utils";

const HIGHLIGHT_MS = 2000;

function PlantList() {
  const plants = usePlantStore((state) => state.plants);
  const newPlantId = usePlantStore((state) => state.newPlantId);
  const clearNewPlantId = usePlantStore((state) => state.clearNewPlantId);
  const { columns } = uiStrings.dashboard;

  useEffect(() => {
    if (!newPlantId) return;
    const timeout = setTimeout(clearNewPlantId, HIGHLIGHT_MS);
    return () => clearTimeout(timeout);
  }, [clearNewPlantId, newPlantId]);

  if (plants.length === 0) return <EmptyState />;

  return (
    <div>
      {/* Column headings are only shown with the table-like layout */}
      <div
        aria-hidden="true"
        className={cn(
          "hidden gap-4 border-b px-3 pb-2 text-sm font-medium text-gray-600 md:grid",
          plantListColumns
        )}
      >
        <span>{columns.name}</span>
        <span>{columns.type}</span>
        <span>{columns.location}</span>
        <span>{columns.watering}</span>
        <span>{columns.light}</span>
      </div>
      <ul className="flex flex-col gap-3 md:gap-0">
        {plants.map((plant) => (
          <PlantListItem
            key={plant.id}
            plant={plant}
            highlighted={plant.id === newPlantId}
          />
        ))}
      </ul>
    </div>
  );
}

export default function MyGardenPage() {
  const plants = usePlantStore((state) => state.plants);
  const { dashboard } = uiStrings;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4">
      <h1 className="text-3xl font-semibold md:text-4xl">{dashboard.title}</h1>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CollectionStatus plants={plants} />
        {plants.length > 0 && (
          <Button asChild className="self-start md:self-auto">
            <Link href="/addPlant">{dashboard.addPlant}</Link>
          </Button>
        )}
      </div>
      <PlantList />
    </div>
  );
}
