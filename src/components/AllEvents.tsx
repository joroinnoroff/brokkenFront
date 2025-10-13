"use client"

import { EventType, fetchEvents } from '@/lib/api';

import Image from 'next/image';
import React, { useEffect, useState } from 'react'

export default function AllEvents() {
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    fetchEvents().then(setEvents).catch(console.error);
  }, []);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("no-NO"); // Output: 10.10.2007
  }
  return (
    <div className='grid gap-20 lg:grid-cols-2 my-12'>
      {events.map((ev, index) => (
        <div key={index} className=' space-y-4 '>
          <div className="relative min-h-[500px]  w-[400px] my-4">
            {ev.image ? (
              <Image
                src={ev.image}
                alt={ev.name}
                fill
                style={{ objectFit: "contain" }}
              />
            ) : (
              <div className="h-12 w-12 bg-gray-200" />
            )}
          </div>

          <p className='font-semibold'>{ev.name}</p>
          <div className='flex items-center gap-12'>
            <span className='text-xs font-extralight'>{ev.location}</span>
            <span className='text-xs font-extralight'>{formatDate(ev.start_date)}</span>
          </div>

          <p className='text-sm tracking-wide'> {ev.description}</p>
        </div>
      ))}
    </div>
  )
}
