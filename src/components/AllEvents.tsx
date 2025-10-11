"use client"

import { EventType, fetchEvents } from '@/lib/api';
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
          <p>{ev.name}</p>
        </div>
      ))}
    </div>
  )
}
