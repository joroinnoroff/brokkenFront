"use client";

import { EventType, fetchEvents } from "@/lib/api";
import { flattenImageUrls, resolveImageUrl } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("no-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateRange(start: string, end: string) {
  const startFormatted = formatDate(start);
  const endFormatted = formatDate(end);
  return startFormatted === endFormatted ? startFormatted : `${startFormatted} – ${endFormatted}`;
}

function EventCard({
  event,
  onImageClick,
}: {
  event: EventType;
  onImageClick: (event: EventType) => void;
}) {
  const imageUrls = flattenImageUrls(event.image)
    .map((url) => resolveImageUrl(url))
    .filter(Boolean);
  const hasImage = imageUrls.length > 0;

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm transition-all hover:border-gray-300 hover:shadow-md w-full max-w-xs">
      <div className="flex flex-col items-start gap-1 px-4 py-3">
        <span className="font-medium text-gray-900">{event.name}</span>
        <span className="text-xs text-gray-500">
          {formatDateRange(event.start_date, event.end_date)}
        </span>
        <span className="text-xs text-gray-500 truncate max-w-full">
          {event.location}
        </span>
      </div>
      {hasImage && (
        <button
          type="button"
          onClick={() => onImageClick(event)}
          className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-inset cursor-pointer"
        >
          <Image
            src={imageUrls[0]}
            alt={event.name}
            fill
            className="object-cover"
          />
        </button>
      )}
    </div>
  );
}

export default function AllEvents() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter((e) => new Date(e.start_date) >= today);
  const previousEvents = events.filter((e) => new Date(e.start_date) < today);

  const handleOpenEvent = (event: EventType) => {
    setSelectedEvent(event);
    setCurrentImageIndex(0);
  };

  if (loading) {
    return (
      <div className="w-full">
        <section className="mb-10">
          <div className="h-7 w-40 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="grid lg:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-lg border border-gray-200 overflow-hidden max-w-xs"
              >
                <div className="flex flex-col gap-1 px-4 py-3">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="aspect-[4/3] w-full bg-gray-200 animate-pulse" />
              </div>
            ))}
          </div>
        </section>
        <section>
          <div className="h-7 w-36 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="grid lg:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-lg border border-gray-200 overflow-hidden max-w-xs"
              >
                <div className="flex flex-col gap-1 px-4 py-3">
                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="aspect-[4/3] w-full bg-gray-200 animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full my-8">
      {upcomingEvents.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming events</h2>
          <div className="grid lg:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id ?? event.name} event={event} onImageClick={handleOpenEvent} />
            ))}
          </div>
        </section>
      )}

      {previousEvents.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Previous events</h2>
          <div className="grid lg:grid-cols-2 gap-4">
            {previousEvents.map((event) => (
              <EventCard key={event.id ?? event.name} event={event} onImageClick={handleOpenEvent} />
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <p className="text-sm text-gray-500">No events to display.</p>
      )}

      <Dialog
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      >
        <DialogContent className="overflow-y-auto max-w-[95vw] w-full max-h-[95vh]  h-full p-2 sm:p-4 flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.name}</DialogTitle>
            <DialogDescription>
              {selectedEvent?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (() => {
            const urls = flattenImageUrls(selectedEvent.image)
              .map((url) => resolveImageUrl(url))
              .filter(Boolean);
            const hasMultiple = urls.length > 1;

            return (
              <div className="space-y-2 flex-1 min-h-0 flex flex-col">
                <p className="text-sm text-gray-500 shrink-0">
                  {formatDateRange(selectedEvent.start_date, selectedEvent.end_date)} · {selectedEvent.location}
                </p>
                {urls.length > 0 ? (
                  <div className="relative flex-1 min-h-[60vh] sm:min-h-[70vh] w-full overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={urls[currentImageIndex]}
                      alt={`${selectedEvent.name} image ${currentImageIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="95vw"
                    />
                    {hasMultiple && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentImageIndex((i) => (i > 0 ? i - 1 : urls.length - 1))
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors cursor-pointer"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentImageIndex((i) => (i < urls.length - 1 ? i + 1 : 0))
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors cursor-pointer"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 px-2 py-1 rounded bg-black/50 text-white text-xs">
                          {currentImageIndex + 1} / {urls.length}
                        </span>
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
