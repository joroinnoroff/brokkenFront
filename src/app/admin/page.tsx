"use client";
import { useEffect, useState } from "react";
import {
  fetchRecords,
  createRecord,
  deleteRecord,
  deleteEvent,
  RecordType,
  EventType,
  fetchEvents,
  createEvent,
} from "@/lib/api";
import AddRecord from "@/app/admin/components/AddRecord";
import Image from "next/image";
import AddEvent from "./components/AddEvent";
import { flattenImageUrls, resolveImageUrl } from "@/lib/utils";
import Link from "next/link";

export default function AdminPage() {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);


  useEffect(() => {
    fetchRecords().then(setRecords).catch(console.error);
    fetchEvents().then(setEvents).catch(console.log)
  }, []);

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
              <Link
                href={`/admin/edit/${e.id}`}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
              >
                Edit
              </Link>
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
                <p className="text-sm text-gray-500">{r.price} kr</p>
              </div>
              <Link
                href={`/admin/edit/${r.id}`}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
              >
                Edit
              </Link>
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


    </div>
  );
}
