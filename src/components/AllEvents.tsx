"use client"

import { EventType, fetchEvents } from '@/lib/api';


import React, { useEffect, useState } from 'react'
import EventsSwiper from './EventsSwiper';

export default function AllEvents() {
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    fetchEvents().then(setEvents).catch(console.error);
  }, []);





  return (
    <div className='lg:w-3/4 my-32'>
      <EventsSwiper images={events.flatMap(event => event.image)} />
    </div>
  )
}
