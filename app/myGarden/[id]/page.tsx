"use client";

import { useParams } from "next/navigation";
import { usePlantStore } from "@/lib/store/plantsStore";
import { Card } from "@/components/ui/card";
import { TPlant } from "@/types/plant";
import Image from "next/image";

export default function PlantDetailPage() {
  const { id } = useParams();
  const plant = usePlantStore((state) => state.plants.find((p) => p.id === id));

  if (!plant) return <div className="p-6">Рослину не знайдено 🌱</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
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
          <h1 className="text-3xl font-semibold">{plant.name}</h1>
          <p className="text-gray-500 italic">plant&apos;s scientific name</p>

          <div className="mt-6 space-y-4">
            <Section label="category" value={plant.type || "—"} />
            <Section
              label="Watering Tips"
              value={plant.wateringFrequency || "No tips available"}
            />
            <Section
              label="Light Requirements"
              value={plant.sunlightNeeds || "No tips available"}
            />
            <Section
              label="Temperature Range"
              value={plant.temperatureRange || "No tips available"}
            />
            <Section
              label="Soil Type"
              value={plant.soilType || "No tips available"}
            />
            <Section
              label="Care Tips"
              value={
                plant.careTips && plant.careTips.length > 0
                  ? plant.careTips.join(", ")
                  : "No tips available"
              }
            />
          </div>
        </Card>
      </div>

      {/* Right side sidebar */}
      <aside className="space-y-4">
        <SidebarCard title="Last Watered">
          <WateringInfo plant={plant} />
        </SidebarCard>

        <SidebarCard title="Next Fertilization">
          <FertilizerInfo plant={plant} />
        </SidebarCard>

        <SidebarCard title="Additional details">
          <Section label="Size" value={`${plant.size} cm`} />
          <Section label="Price" value={plant.price} />
          <Section label="Destination" value={plant.dest || "—"} />
          <Section label="Amount" value={plant.amount} />
        </SidebarCard>

        <SidebarCard title="Notes">
          {plant.notes ? (
            <p className="whitespace-pre-wrap">{plant.notes}</p>
          ) : (
            <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg">
              No notes available
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
      <p className="text-gray-500 italic">{value}</p>
    </div>
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
    return <p className="bg-gray-50 p-4 rounded-lg">No info about watering</p>;

  const daysSince = Math.floor(
    (Date.now() - new Date(plant.lastWatered).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      <p>Last watred: {new Date(plant.lastWatered).toLocaleDateString()}</p>
      <p className="text-sm text-gray-500">{daysSince} days since</p>
    </>
  );
}

function FertilizerInfo({ plant }: { plant: TPlant }) {
  return (
    <p className="bg-gray-50 p-4 rounded-lg">
      Next fertilization: <b>{plant.nextFertilize || "not planned"}</b>
    </p>
  );
}
