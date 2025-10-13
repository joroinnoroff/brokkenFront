"use client";
import { useEffect, useState } from "react";
import {
  fetchEventById,
  fetchRecordById,
  updateEvent,
  updateRecord,
  RecordType,
  EventType
} from "@/lib/api";
import EditSelected from "../../components/EditSelected";

interface PageProps {
  params: { id: string };
}

export default function ProductDetailsPage({ params }: PageProps) {
  const { id } = params;
  const [item, setItem] = useState<RecordType | EventType | null>(null);
  const [isEvent, setIsEvent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      const eventData = await fetchEventById(id);
      if (eventData) {
        setItem(eventData);
        setIsEvent(true);
      } else {
        const recordData = await fetchRecordById(id);
        setItem(recordData);
        setIsEvent(false);
      }
      setLoading(false);
    };

    loadData();
  }, [id]);

  const handleSave = async (data: RecordType | EventType) => {
    if (!data.id) return alert("Missing ID");

    if (isEvent) {
      await updateEvent(data.id, data as EventType);
      alert("✅ Event updated!");
    } else {
      await updateRecord(data.id, data as RecordType);
      alert("✅ Record updated!");
    }
  };

  if (loading) return <p className="p-4">⏳ Loading...</p>;
  if (!item) return <p className="p-4">❌ Not found</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">
        Editing {isEvent ? "Event" : "Record"}: {item.name}
      </h1>

      <EditSelected item={item} type={isEvent ? "event" : "record"} onSave={handleSave} />

      <div className="mt-4">
        <p><strong>ID:</strong> {item.id}</p>
        <p><strong>Description:</strong> {item.description}</p>

        {isEvent ? (
          <>
            <p><strong>Start date:</strong> {(item as EventType).start_date}</p>
            <p><strong>End date:</strong> {(item as EventType).end_date}</p>
            <p><strong>Location:</strong> {(item as EventType).location}</p>
          </>
        ) : (
          <>
            <p><strong>Release date:</strong> {(item as RecordType).release_date}</p>
            <p><strong>Price:</strong> {(item as RecordType).price} NOK</p>
          </>
        )}
      </div>
    </div>
  );
}
