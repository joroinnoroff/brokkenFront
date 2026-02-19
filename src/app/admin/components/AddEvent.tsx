"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { resolveImageUrl } from "@/lib/utils";

interface EventData {
  name: string;
  image: string[];
  start_date: string;
  end_date: string;
  location: string;
  description: string;
}

interface AddEventProps {
  onSubmit: (event: EventData) => void;
}

export default function AddEvent({ onSubmit }: AddEventProps) {
  const [formData, setFormData] = useState<EventData>({
    name: "",
    image: [],
    start_date: "",
    end_date: "",
    location: "",
    description: "",
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setUploading(true);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFormData((prev) => ({ ...prev, image: [...prev.image, data.url] }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.image?.length) {
      alert("Please upload an image first!");
      return;
    }
    onSubmit(formData);
    setFormData({
      name: "",
      image: [],
      start_date: "",
      end_date: "",
      location: "",
      description: "",
    });
  };

  const inputClass =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black";

  return (
    <Dialog>
      <DialogTrigger className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50">
        Create new event
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>Fill in the fields to create a new event.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Event name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-sm file:mr-2 file:rounded file:border-0 file:bg-black file:px-3 file:py-1.5 file:text-white file:text-sm"
            />
            {uploading && <p className="mt-1 text-sm text-gray-500">Uploading...</p>}
            {formData.image?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-3">
                {formData.image.map((img, idx) => {
                  const src = resolveImageUrl(img);
                  return src ? (
                  <div key={idx} className="relative h-24 w-24 shrink-0">
                    <Image
                      src={src}
                      alt={`Upload ${idx + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          image: prev.image.filter((_, i) => i !== idx),
                        }))
                      }
                      className="absolute top-0.5 right-0.5 rounded bg-black px-1.5 py-0.5 text-xs text-white hover:bg-gray-800"
                    >
                      x
                    </button>
                  </div>
                  ) : (
                    <div key={idx} className="flex h-24 w-24 items-center justify-center rounded border bg-gray-100 text-xs text-gray-500">
                      Uploaded
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputClass}
              placeholder="Venue or address"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Start date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">End date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`${inputClass} min-h-[80px] resize-y`}
              placeholder="Event description"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Add Event
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
