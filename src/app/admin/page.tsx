"use client";
import { useEffect, useState } from "react";
import { fetchRecords, createRecord } from "@/api/records/route";
import AddRecord from "@/app/admin/components/AddRecord";

import Image from "next/image";


interface RecordType {
  id?: number;
  name: string;
  image: string;
  release_date: string;
  price: number;
  description: string;
}
export default function RecordsPage() {
  const [records, setRecords] = useState<RecordType[]>([]);

  useEffect(() => {
    fetchRecords().then(setRecords);
  }, []);

  const handleNewRecord = async (record: Omit<RecordType, "id">) => {
    const res = await createRecord(record);
    setRecords(prev => [...prev, res])
  }

  const handleDeleteRecord = async (id: number) => {
    const res = await fetch(`/api/records?id=${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error(await res.text()); // see backend error
      throw new Error("Failed to delete record");
    }

    setRecords(prev => prev.filter(record => record.id !== id));
  };






  return (
    <div>
      <AddRecord onSubmit={handleNewRecord} />
      <ul>
        {records.map(r => (
          <li key={r.id}>
            <div className="relative h-12 w-12">
              {r?.image ? (
                <Image src={r.image} alt={r.name} fill />
              ) : (
                <div className="h-12 w-12 bg-gray-200" />
              )}

            </div>
            {r.name} - {r.price} kr

            <button
              className="ml-2 text-red-500"
              onClick={() => handleDeleteRecord(r.id!)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
