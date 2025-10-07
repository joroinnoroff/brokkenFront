"use client";
import { useEffect, useState } from "react";
import { fetchRecords, createRecord } from "@/api/records/route";

export default function RecordsPage() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    fetchRecords().then(setRecords);
  }, []);

  const handleAdd = async () => {
    const newRecord = {
      name: "Test Record",
      image: "https://example.com/image.jpg",
      release_date: new Date().toISOString(),
      price: 199,
      description: "Test description",
    };
    const res = await createRecord(newRecord);
    setRecords(prev => [...prev, res]);
  };

  return (
    <div>
      <button onClick={handleAdd}>Add Record</button>
      <ul>
        {records.map(r => (
          <li key={r.id}>{r.name} - ${r.price}</li>
        ))}
      </ul>
    </div>
  );
}
