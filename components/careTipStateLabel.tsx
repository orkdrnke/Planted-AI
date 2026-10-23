import { AlertCircle, Check, Loader2 } from "lucide-react";
import { TCareTipsState } from "@/lib/careTipsState";
import { uiStrings } from "@/lib/uiStrings";
import { cn } from "@/lib/utils";

const styles: Record<TCareTipsState, string> = {
  ready: "bg-green-100 text-green-800",
  generating: "bg-gray-100 text-gray-700",
  failed: "bg-red-100 text-red-800",
};

// The state is always conveyed by the text; the icon and colour are decorative
export function CareTipStateLabel({ state }: { state: TCareTipsState }) {
  const Icon =
    state === "ready" ? Check : state === "generating" ? Loader2 : AlertCircle;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        styles[state]
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn("size-3", state === "generating" && "animate-spin")}
      />
      {uiStrings.careTipState[state]}
    </span>
  );
}
