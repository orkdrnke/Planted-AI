import Link from "next/link";
import { CareTipStateLabel } from "@/components/careTipStateLabel";
import { getCareTipsState, TCareTipsState } from "@/lib/careTipsState";
import { uiStrings } from "@/lib/uiStrings";
import { cn } from "@/lib/utils";
import { TPlant } from "@/types/plant";

// Shared column template, also used by the dashboard's heading row
export const plantListColumns =
  "md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.2fr)]";

function careNote(
  state: TCareTipsState,
  short: string | undefined,
  full: string | undefined
) {
  if (state === "generating") return uiStrings.cell.generating;
  if (state === "failed") return uiStrings.cell.failed;
  // Ready tips saved without short notes fall back to the full text
  return short || full || uiStrings.cell.noLocation;
}

export function PlantListItem({
  plant,
  highlighted = false,
}: {
  plant: TPlant;
  highlighted?: boolean;
}) {
  const state = getCareTipsState(plant);
  const { columns } = uiStrings.dashboard;
  const watering = careNote(state, plant.wateringShort, plant.wateringFrequency);
  const light = careNote(state, plant.sunlightShort, plant.sunlightNeeds);
  // A full-text fallback can be long, so only then it may be cut
  const noteClass = (short: string | undefined) =>
    state === "ready" && !short ? "md:truncate" : undefined;

  return (
    <li>
      <Link
        href={`/myGarden/${plant.id}`}
        className={cn(
          "grid gap-1 rounded-xl border p-4 text-base hover:bg-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "md:items-center md:gap-4 md:rounded-none md:border-0 md:border-b md:px-3 md:py-3",
          plantListColumns,
          highlighted && "animate-highlight"
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate font-medium">{plant.name}</span>
          <CareTipStateLabel state={state} />
        </span>
        <span className="flex min-w-0 gap-1 text-gray-600 md:contents">
          <span className="md:truncate">{plant.type}</span>
          <span aria-hidden="true" className="md:hidden">
            ·
          </span>
          <span className="md:truncate">
            {plant.dest || uiStrings.cell.noLocation}
          </span>
        </span>
        <span className={noteClass(plant.wateringShort)}>
          <span className="md:sr-only">{columns.watering}: </span>
          {watering}
        </span>
        <span className={noteClass(plant.sunlightShort)}>
          <span className="md:sr-only">{columns.light}: </span>
          {light}
        </span>
      </Link>
    </li>
  );
}
