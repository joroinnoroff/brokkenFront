"use client"

import { fetchRecords } from '@/lib/api';
import Image from 'next/image';
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
    fetchRecords().then(setRecords).catch(console.error);
  }, []);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("no-NO"); // Output: 10.10.2007
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("no-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 0
    }).format(price); // Output: 500 kr
  }

  return (
    <div className='w-full h-full  '>
      <span>({records.length})</span>
      <div className='grid   lg:grid-cols-2 items-center lg:justify-items-center'>
        {records.map((record, index) => (
          <div key={index} className='flex items-center gap-12 my-8'>
            <div className="relative h-28 w-28">
              {record.image ? (
                <Image
                  src={record.image}
                  alt={record.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="h-12 w-12 bg-gray-200" />
              )}
            </div>
            <div>

              <p className='text-xs font-light'>Released: {formatDate(record.release_date)}</p>
              <p className='font-light'>{record.name}</p>
              <p className='mt-4'>{formatPrice(record.price)}</p>
              <button>Add to cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
