"use client"
import { fetchRecords } from '@/api/records/route';
import React, { useEffect, useState } from 'react'
interface RecordType {
  id?: number;
  name: string;
  image: string;
  release_date: string;
  price: number;
  description: string;
}
export default function page() {
  const [records, setRecords] = useState<RecordType[]>([]);

  useEffect(() => {
    fetchRecords().then(setRecords);
  }, []);
  return (
    <div className='min-h-screen w-full'>
      <div className='px-8 pt-20'>
        <h1>All records</h1>


        <div className="container">
          {records.map((record, index) => (
            <div key={index}>
              <p>{record.name}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
