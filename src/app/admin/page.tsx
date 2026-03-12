"use client";
import { useEffect, useState } from "react";
import {
  fetchRecords,
  createRecord,
  deleteRecord,
  deleteEvent,
  updateRecord,
  RecordType,
  EventType,
  fetchEvents,
  createEvent,
} from "@/lib/api";
import AddRecord from "@/app/admin/components/AddRecord";
import AddEvent from "./components/AddEvent";
import EditRecordModal from "./components/EditRecordModal";
import EditEventModal from "./components/EditEventModal";
import Image from "next/image";
import { flattenImageUrls, resolveImageUrl } from "@/lib/utils";

export default function AdminPage() {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [editingRecord, setEditingRecord] = useState<RecordType | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);


  useEffect(() => {
    fetchRecords().then(setRecords).catch(console.error);
    fetchEvents().then(setEvents).catch(console.log);
  }, []);

  const refreshRecords = () => fetchRecords().then(setRecords).catch(console.error);
  const refreshEvents = () => fetchEvents().then(setEvents).catch(console.log);

  const handleNewRecord = async (record: Omit<RecordType, "id">) => {
    const res = await createRecord(record as RecordType);
    setRecords(prev => [...prev, res]);
  };


  const handleNewEvent = async (event: Omit<EventType, "id">) => {
    const res = await createEvent(event as EventType);
    setEvents(prev => [...prev, res]);
  };

  const handleDeleteRecord = async (id: number) => {
    await deleteRecord(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleToggleAvailability = async (record: RecordType) => {
    const next: "Available" | "Sold" =
      record.availability === "Sold" ? "Available" : "Sold";
    try {
      await updateRecord(record.id!, { ...record, availability: next });
      setRecords((prev) =>
        prev.map((r) =>
          r.id === record.id ? { ...r, availability: next } : r
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update availability");
    }
  };

  const handleDeleteEvent = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteEvent(id);
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  return (
    <div className="min-h-screen w-full px-8 pt-20">
      <div className="flex gap-12 items-center my-12 border-b pb-5">
        <AddEvent onSubmit={handleNewEvent} />
        <AddRecord onSubmit={handleNewRecord} />
      </div>
      <div>
        <h2>Events</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {events.map((e) => {
            const urls = flattenImageUrls(e.image);
            const imgSrc = urls[0] ? resolveImageUrl(urls[0]) : "";
            return (
            <li key={e.id} className="flex items-center gap-4">
              <div className="relative h-12 w-12 shrink-0">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={e.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-200" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{e.name}</p>
                <p className="text-sm text-gray-500 truncate">{e.location}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingEvent(e)}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                className="text-red-500 hover:text-red-600 text-sm font-medium"
                onClick={(ev) => handleDeleteEvent(e.id!, ev)}
              >
                Delete
              </button>
            </li>
          );
          })}
        </ul>



        <hr className="my-12" />
        <h2>Records</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {records.map((r) => {
            const imgSrc = r.image?.[0] ? resolveImageUrl(r.image[0]) : "";
            return (
            <li key={r.id} className="flex items-center gap-4">
              <div className="relative h-12 w-12 shrink-0">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={r.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-200" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{r.name}</p>
                <p className="text-sm text-gray-500">
                  {r.price} kr
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleAvailability(r)}
                  className={`rounded px-2.5 py-1 text-xs font-medium ${
                    r.availability === "Sold"
                      ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                  title={r.availability === "Sold" ? "Mark as Available" : "Mark as Sold"}
                >
                  {r.availability === "Sold" ? "Sold" : "Available"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRecord(r)}
                  className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
                >
                  Edit
                </button>
              </div>
              <button
                className="text-red-500 hover:text-red-600 text-sm font-medium"
                onClick={() => handleDeleteRecord(r.id!)}
              >
                Delete
              </button>
            </li>
          );
          })}
        </ul>
      </div>

      <EditEventModal
        event={editingEvent}
        open={!!editingEvent}
        onOpenChange={(open) => !open && setEditingEvent(null)}
        onSuccess={refreshEvents}
      />
      <EditRecordModal
        record={editingRecord}
        open={!!editingRecord}
        onOpenChange={(open) => !open && setEditingRecord(null)}
        onSuccess={refreshRecords}
      />
    </div>
  );
}
