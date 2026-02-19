"use client";

import { EventType, fetchEvents } from "@/lib/api";
import { flattenImageUrls, resolveImageUrl } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import EventsSwiper from "./EventsSwiper";

export default function AllEvents() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="lg:w-3/4 my-32 animate-pulse">
        <div className="aspect-square w-full max-w-md bg-gray-200 rounded" />
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  const images = events
    .flatMap((e) => flattenImageUrls(e.image).map((url) => resolveImageUrl(url)))
    .filter(Boolean);
  return (
    <div className="lg:w-3/4 my-32">
      {images.length > 0 ? (
        <EventsSwiper images={images} />
      ) : (
        <p className="text-sm text-gray-500">No event images to display.</p>
      )}
    </div>
  );
}
