import { getCollectionStatus } from "@/lib/careTipsState";
import { uiStrings } from "@/lib/uiStrings";
import { TPlant } from "@/types/plant";

export function CollectionStatus({ plants }: { plants: TPlant[] }) {
  const { total, ready, generating, failed } = getCollectionStatus(plants);
  const { status } = uiStrings;

  return (
    <p
      aria-label={status.label}
      className="flex flex-wrap gap-x-2 text-base text-gray-700"
    >
      <span className="font-medium">{status.total(total)}</span>
      <span aria-hidden="true">·</span>
      <span>{status.ready(ready)}</span>
      <span aria-hidden="true">·</span>
      <span>{status.generating(generating)}</span>
      <span aria-hidden="true">·</span>
      <span>{status.failed(failed)}</span>
    </p>
  );
}
