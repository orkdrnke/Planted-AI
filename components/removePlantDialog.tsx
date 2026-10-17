"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { uiStrings } from "@/lib/uiStrings";

const { removeDialog, plantPage } = uiStrings;

// Remove control plus its confirmation; Radix handles the focus trap and focus return
export function RemovePlantDialog({
  plantName,
  onConfirm,
}: {
  plantName: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
        >
          {plantPage.remove}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="break-words">{removeDialog.title(plantName)}</DialogTitle>
          <DialogDescription>{removeDialog.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              {removeDialog.cancel}
            </Button>
          </DialogClose>
          <Button variant="destructive" className="cursor-pointer" onClick={onConfirm}>
            {removeDialog.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
