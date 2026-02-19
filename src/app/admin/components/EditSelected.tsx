"use client";
import React, { useState } from "react";
import Image from "next/image";
import { EventType, RecordType, updateEvent, updateRecord } from "@/lib/api";
import { flattenImageUrls, resolveImageUrl } from "@/lib/utils";

type EditSelectedProps = {
  item: RecordType | EventType;
};

function normalizeImage(img: unknown): string[] {
  return flattenImageUrls(img);
}

export default function EditSelected({ item }: EditSelectedProps) {
  const [formData, setFormData] = useState<RecordType | EventType>({
    ...item,
    image: normalizeImage(item.image),
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      setFormData((prev) => ({
        ...prev,
        image: [...normalizeImage(prev.image), data.url],
      }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      image: normalizeImage(prev.image).filter((_, i) => i !== index),
    }));

  const handleSubmit = async () => {
    try {
      if ("release_date" in formData) {
        // It's a Record
        const payload: Partial<RecordType> = {
          ...formData,
          release_date: formData.release_date?.split("T")[0] ?? "",
        };
        await updateRecord(item.id!, payload);
      } else {
        // It's an Event
        const payload: Partial<EventType> = {
          ...formData,
          start_date: formData.start_date?.split("T")[0] ?? "",
          end_date: formData.end_date?.split("T")[0] ?? "",
        };
        await updateEvent(item.id!, payload);
      }

      alert("Updated successfully!");
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Update failed");
    }
  };

  const formatDate = (date?: string) => date?.split("T")[0] || "";

  return (
    <div className="mt-6 flex flex-col gap-3">
      <input
        name="name"
        value={formData.name ?? ""}
        onChange={handleChange}
        className="border px-2 py-1 w-full"
        placeholder="Name"
      />

      <textarea
        name="description"
        value={formData.description ?? ""}
        onChange={handleChange}
        className="border px-2 py-1 w-full mt-2"
        placeholder="Description"
      />

      {/* Record fields */}
      {"release_date" in formData && (
        <>
          <input
            type="date"
            name="release_date"
            value={formatDate(formData.release_date)}
            onChange={handleChange}
            className="border px-2 py-1 w-full"
          />
          {"genre" in formData && (
            <input
              name="genre"
              value={Array.isArray(formData.genre) ? formData.genre.join(", ") : ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  genre: e.target.value.split(",").map((g) => g.trim()).filter(Boolean),
                }))
              }
              className="border px-2 py-1 w-full"
              placeholder="Genres (comma-separated)"
            />
          )}
        </>
      )}

      {/* Event fields */}
      {"start_date" in formData && (
        <input
          type="date"
          name="start_date"
          value={formatDate(formData.start_date)}
          onChange={handleChange}
          className="border px-2 py-1 w-full mt-2"
        />
      )}
      {"end_date" in formData && (
        <input
          type="date"
          name="end_date"
          value={formatDate(formData.end_date)}
          onChange={handleChange}
          className="border px-2 py-1 w-full mt-2"
        />
      )}
      {"location" in formData && (
        <input
          name="location"
          value={formData.location ?? ""}
          onChange={handleChange}
          className="border px-2 py-1 w-full mt-2"
          placeholder="Location"
        />
      )}

      {/* Image preview / upload */}
      <div className="flex flex-col gap-4 mt-2">
        {normalizeImage(formData.image).length > 0 && (
          <div className="flex flex-wrap gap-3">
            {normalizeImage(formData.image).map((img, idx) => {
              const src = resolveImageUrl(img);
              return src ? (
              <div key={idx} className="relative h-24 w-24 shrink-0">
                <Image
                  src={src}
                  alt={`${formData.name ?? "Image"} ${idx + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded p-1 text-xs hover:bg-red-600"
                >
                  x
                </button>
              </div>
              ) : (
                <div key={idx} className="flex h-24 w-24 items-center justify-center rounded border bg-gray-100 text-xs text-gray-500">
                  Image
                </div>
              );
            })}
          </div>
        )}
        <input type="file" onChange={handleFileChange} className="text-sm" />
        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white mt-4 px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}
