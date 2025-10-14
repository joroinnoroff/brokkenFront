"use client"

import { EventType, fetchEvents } from '@/lib/api';

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import EventsSwiper from './EventsSwiper';

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
    <div className='lg:w-3/4 my-32'>
      <EventsSwiper images={events.flatMap(event => event.image)} />
    </div>
  )
}
