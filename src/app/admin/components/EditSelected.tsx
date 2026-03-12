"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { EventType, RecordType, updateEvent, updateRecord } from "@/lib/api";
import { flattenImageUrls, resolveImageUrl } from "@/lib/utils";

type EditSelectedProps = {
  item: RecordType | EventType;
  onSuccess?: () => void;
};

function normalizeImage(img: unknown): string[] {
  return flattenImageUrls(img);
}

function normalizeGenre(genre: unknown): string[] {
  if (Array.isArray(genre)) return genre.filter((g): g is string => typeof g === "string");
  if (typeof genre === "string" && genre.trim()) return [genre.trim()];
  return [];
}

export default function EditSelected({ item, onSuccess }: EditSelectedProps) {
  const [formData, setFormData] = useState<RecordType | EventType>({
    ...item,
    image: normalizeImage(item.image),
    ...("release_date" in item && {
      genre: normalizeGenre((item as RecordType).genre),
      availability:
        (item as RecordType).availability === "Sold" ? "Sold" : "Available",
    }),
  });
  const [genreInput, setGenreInput] = useState(
    Array.isArray((item as RecordType).genre) && "release_date" in item
      ? (item as RecordType).genre!.join(", ")
      : ""
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if ("release_date" in item) {
      setGenreInput(
        Array.isArray((item as RecordType).genre)
          ? (item as RecordType).genre!.join(", ")
          : ""
      );
    }
  }, [item]);

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
        const genre = genreInput
          ? genreInput.split(",").map((g) => g.trim()).filter(Boolean)
          : [];
        const payload: Partial<RecordType> = {
          ...formData,
          genre,
          availability: (formData as RecordType).availability ?? "Available",
          release_date: formData.release_date?.split("T")[0] ?? "",
        };
        await updateRecord(item.id!, payload);
        onSuccess?.();
      } else {
        // It's an Event
        const payload: Partial<EventType> = {
          ...formData,
          start_date: formData.start_date?.split("T")[0] ?? "",
          end_date: formData.end_date?.split("T")[0] ?? "",
        };
        await updateEvent(item.id!, payload);
        onSuccess?.();
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

      {/* Record fields - Availability first for prominence */}
      {"release_date" in formData && (
        <>
          <div className="mb-2">
            <label className="mb-1 block text-sm font-medium">Availability</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, availability: "Available" }))
                }
                className={`rounded px-3 py-1.5 text-sm font-medium ${
                  (formData as RecordType).availability === "Sold"
                    ? "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    : "bg-black text-white"
                }`}
              >
                Available
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, availability: "Sold" }))
                }
                className={`rounded px-3 py-1.5 text-sm font-medium ${
                  (formData as RecordType).availability === "Sold"
                    ? "bg-black text-white"
                    : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Sold
              </button>
            </div>
          </div>
          <input
            type="date"
            name="release_date"
            value={formatDate(formData.release_date)}
            onChange={handleChange}
            className="border px-2 py-1 w-full"
          />
          <div>
            <label className="mb-1 block text-sm font-medium">Genres</label>
            <input
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              className="border px-2 py-1 w-full"
              placeholder="Jazz, Electronic, Experimental (comma-separated)"
            />
          </div>
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
