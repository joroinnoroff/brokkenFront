"use client";
import { useEffect, useState } from "react";
import { fetchRecords, createRecord, deleteRecord, RecordType, EventType, fetchEvents, createEvent } from "@/lib/api";
import AddRecord from "@/app/admin/components/AddRecord";
import Image from "next/image";
import AddEvent from "./components/AddEvent";

export default function RecordsPage() {
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
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen w-full px-8 pt-20">
      <div className="flex gap-12 items-center my-12 border-b pb-5">
        <AddEvent onSubmit={handleNewEvent} />
        <AddRecord onSubmit={handleNewRecord} />
      </div>
      <ul className="mt-4 flex flex-col gap-4">
        {records.map(r => (
          <li key={r.id} className="flex items-center gap-4">
            <div className="relative h-12 w-12">
              {r.image ? (
                <Image
                  src={r.image}
                  alt={r.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="h-12 w-12 bg-gray-200" />
              )}
            </div>
            <div>
              <p>{r.name}</p>
              <p>{r.price} kr</p>
            </div>
            <button className="ml-auto text-red-500" onClick={() => handleDeleteRecord(r.id!)}>
              Delete
            </button>
          </li>
        ))}
      </ul>


    </div>
  );
}
