"use client";
import { useEffect, useState } from "react";
import { fetchRecords, createRecord, deleteRecord, RecordType } from "@/lib/api";
import AddRecord from "@/app/admin/components/AddRecord";
import Image from "next/image";

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordType[]>([]);

  useEffect(() => {
    fetchRecords().then(setRecords).catch(console.error);
  }, []);

  const handleNewRecord = async (record: Omit<RecordType, "id">) => {
    const res = await createRecord(record as RecordType);
    setRecords(prev => [...prev, res]);
  };

  const handleDeleteRecord = async (id: number) => {
    await deleteRecord(id);
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div>
      <AddRecord onSubmit={handleNewRecord} />
      <ul>
        {records.map(r => (
          <li key={r.id}>
            <div className="relative h-12 w-12">
              {r.image ? <Image src={r.image} alt={r.name} fill /> : <div className="h-12 w-12 bg-gray-200" />}
            </div>
            {r.name} - {r.price} kr
            <button className="ml-2 text-red-500" onClick={() => handleDeleteRecord(r.id!)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
