"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditSelected from "./EditSelected";
import type { EventType } from "@/lib/api";

interface EditEventModalProps {
  event: EventType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function EditEventModal({
  event,
  open,
  onOpenChange,
  onSuccess,
}: EditEventModalProps) {
  if (!event) return null;

  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Event: {event.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <EditSelected item={event} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
