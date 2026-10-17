"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePlantStore } from "@/lib/store/plantsStore";
import { Card } from "@/components/ui/card";
import { TPlant } from "@/types/plant";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronLeft, Loader2 } from "lucide-react";
import { CareTipStateLabel } from "@/components/careTipStateLabel";
import { getCareTipsState, TCareTipsState } from "@/lib/careTipsState";
import { uiStrings } from "@/lib/uiStrings";

const { plantPage, notFound, cell } = uiStrings;

export default function PlantDetailPage() {
  const { id } = useParams();
  const plant = usePlantStore((state) => state.plants.find((p) => p.id === id));

  if (!plant) {
    return (
      <div className="space-y-4 p-6">
        <h1 className="text-2xl font-semibold">{notFound.title}</h1>
        <Button asChild variant="outline">
          <Link href="/myGarden">{notFound.back}</Link>
        </Button>
      </div>
    );
  }

  const state = getCareTipsState(plant);
  // Text of an AI field: stored value when ready, otherwise the state label
  const tipText = (value: string | undefined) => {
    if (state === "generating") return cell.generating;
    if (state === "failed") return cell.failed;
    return value || cell.noLocation;
  };
  const careTips =
    state === "ready" && plant.careTips?.length
      ? plant.careTips.map((tip) => `• ${tip}`).join("\n")
      : tipText(undefined);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      <Link
        href="/myGarden"
        className="flex items-center gap-1 text-gray-700 hover:underline lg:col-span-3"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
        {plantPage.back}
      </Link>

      {/* === Left side === */}
      <div className="lg:col-span-2 space-y-6">
        {/* Photo */}
        <Card className="overflow-hidden rounded-2xl shadow-md">
          <div style={{ width: 200, height: 200 }}>
            <Image
              src={`/img/${plant.type}.png`}
              alt={plant.name}
              width={200}
              height={200}
              style={{ width: 200, height: 200, objectFit: "contain" }}
            />
          </div>
        </Card>

        {/* Details */}
        <Card className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold break-words">{plant.name}</h1>
            <CareTipStateLabel state={state} />
          </div>
          {plant.botanicalName && (
            <p className="text-gray-500 italic">
              {plantPage.botanicalName}: {plant.botanicalName}
            </p>
          )}

          <AiCareStatus plant={plant} state={state} />

          <div className="mt-6 space-y-4">
            <Section label={plantPage.sections.category} value={plant.type || "—"} />
            <Section
              label={plantPage.sections.watering}
              value={tipText(plant.wateringFrequency)}
            />
            <Section
              label={plantPage.sections.light}
              value={tipText(plant.sunlightNeeds)}
            />
            <Section
              label={plantPage.sections.temperature}
              value={tipText(plant.temperatureRange)}
            />
            <Section label={plantPage.sections.soil} value={tipText(plant.soilType)} />
            <Section label={plantPage.sections.careTips} value={careTips} />
          </div>
        </Card>
      </div>

      {/* Right side sidebar */}
      <aside className="space-y-4">
        <SidebarCard title={plantPage.sidebar.lastWatered}>
          <WateringInfo plant={plant} />
        </SidebarCard>

        <SidebarCard title={plantPage.sidebar.nextFertilization}>
          <FertilizerInfo plant={plant} />
        </SidebarCard>

        <SidebarCard title={plantPage.sidebar.additionalDetails}>
          <Section
            label={plantPage.sidebar.size}
            value={plantPage.sidebar.sizeValue(plant.size)}
          />
          <Section label={plantPage.sidebar.price} value={plant.price} />
          <Section label={plantPage.sidebar.location} value={plant.dest || "—"} />
          <Section label={plantPage.sidebar.amount} value={plant.amount} />
        </SidebarCard>

        <SidebarCard title={plantPage.sidebar.notes}>
          {plant.notes ? (
            <p className="whitespace-pre-wrap">{plant.notes}</p>
          ) : (
            <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg">
              {plantPage.sidebar.noNotes}
            </p>
          )}
        </SidebarCard>
      </aside>
    </div>
  );
}

function Section({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium text-gray-700 ">{label}</h3>
      <p className="text-gray-500 italic whitespace-pre-line">{value}</p>
    </div>
  );
}

function AiCareStatus({ plant, state }: { plant: TPlant; state: TCareTipsState }) {
  const generateCareTips = usePlantStore((store) => store.generateCareTips);
  const retry = () => void generateCareTips(plant.id);

  if (state === "generating") {
    return (
      <div
        role="status"
        className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg text-gray-700"
      >
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        {plantPage.generating}
      </div>
    );
  }

  // One fixed sentence; the technical aiError is never shown
  if (state === "failed") {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center gap-3 bg-red-50 p-4 rounded-lg text-red-700"
      >
        <AlertCircle aria-hidden="true" className="size-4" />
        <span className="flex-1">{plantPage.failed}</span>
        <Button variant="outline" className="cursor-pointer" onClick={retry}>
          {plantPage.retry}
        </Button>
      </div>
    );
  }

  // Stored tips stay visible while a regeneration runs or after it fails (ADR-0002)
  return (
    <Button
      variant="outline"
      className="cursor-pointer"
      onClick={retry}
      disabled={plant.aiStatus === "generating"}
    >
      {plantPage.regenerate}
    </Button>
  );
}

function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </Card>
  );
}

function WateringInfo({ plant }: { plant: TPlant }) {
  if (!plant.lastWatered)
    return (
      <p className="bg-gray-50 p-4 rounded-lg">{plantPage.sidebar.noWateringInfo}</p>
    );

  const daysSince = Math.floor(
    (Date.now() - new Date(plant.lastWatered).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <>
      <p>
        {plantPage.sidebar.lastWateredOn(
          new Date(plant.lastWatered).toLocaleDateString()
        )}
      </p>
      <p className="text-sm text-gray-500">{plantPage.sidebar.daysSince(daysSince)}</p>
    </>
  );
}

function FertilizerInfo({ plant }: { plant: TPlant }) {
  return (
    <p className="bg-gray-50 p-4 rounded-lg">
      {plantPage.sidebar.nextFertilization}:{" "}
      <b>{plant.nextFertilize || plantPage.sidebar.notPlanned}</b>
    </p>
  );
}
