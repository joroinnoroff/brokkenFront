"use client"

import { EventType, fetchEvents } from '@/lib/api';

import Image from 'next/image';
import React, { useEffect, useState } from 'react'

export default function AllEvents() {
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    fetchEvents().then(setEvents).catch(console.error);
  }, []);
  return (
    <div>
      {events.map((ev, index) => (
        <div key={index}>
          <div className="relative min-h-[400px]  w-full">
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
        </div>
      ))}
    </div>
  )
}
