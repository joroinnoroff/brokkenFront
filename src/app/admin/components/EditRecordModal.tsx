"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditSelected from "./EditSelected";
import type { RecordType } from "@/lib/api";

interface EditRecordModalProps {
  record: RecordType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function EditRecordModal({
  record,
  open,
  onOpenChange,
  onSuccess,
}: EditRecordModalProps) {
  if (!record) return null;

  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Record: {record.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <EditSelected item={record} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
