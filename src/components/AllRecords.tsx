"use client"
import { fetchRecords } from '@/app/api/records/route';
import React, { useEffect, useState } from 'react'
interface RecordType {
  id?: number;
  name: string;
  image: string;
  release_date: string;
  price: number;
  description: string;
}
export default function AllRecords() {
  const [records, setRecords] = useState<RecordType[]>([]);

  useEffect(() => {
    fetchRecords().then(setRecords);
  }, []);
  return (
    <div>
      {records.map((record, index) => (
        <div key={index}>
          <p>{record.name}</p>
        </div>
      ))}
    </div>
  )
}
