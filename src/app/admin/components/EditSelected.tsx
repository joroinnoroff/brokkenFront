"use client";
import React, { useState } from "react";
import Image from "next/image";
import { EventType, RecordType } from "@/lib/api";


type EditSelectedProps = {
  item: RecordType | EventType;
  type: "record" | "event";
  onSave: (data: RecordType | EventType) => void;
};

export default function EditSelected({ item, type, onSave }: EditSelectedProps) {
  const [formData, setFormData] = useState(item);
  const [uploading, setUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    const form = new FormData();
    form.append("file", file);

    setUploading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/uploads`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      setFormData((prev) => ({ ...prev, image: data.url }));
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submitEdit = async () => onSave(formData);

  return (
    <div className="flex flex-col gap-3 p-4 border rounded">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="border px-2 py-1"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="border px-2 py-1"
      />

      {type === "record" && (
        <>
          <input
            name="release_date"
            type="date"
            value={(formData as RecordType).release_date}
            onChange={handleChange}
            className="border px-2 py-1"
          />

          <input
            name="price"
            type="number"
            value={(formData as RecordType).price}
            onChange={handleChange}
            className="border px-2 py-1"
            placeholder="Price"
          />
        </>
      )}

      {type === "event" && (
        <>
          <input
            name="start_date"
            type="date"
            value={(formData as EventType).start_date}
            onChange={handleChange}
            className="border px-2 py-1"
          />
          <input
            name="end_date"
            type="date"
            value={(formData as EventType).end_date}
            onChange={handleChange}
            className="border px-2 py-1"
          />
          <input
            name="location"
            value={(formData as EventType).location}
            onChange={handleChange}
            placeholder="Location"
            className="border px-2 py-1"
          />
        </>
      )}

      <div>
        <input type="file" onChange={handleFileChange} />
        {uploading && <p>Uploading image...</p>}
        {formData.image && (
          <Image
            src={formData.image}
            alt="Preview"
            width={150}
            height={150}
            className="mt-2 object-cover"
          />
        )}
      </div>

      <button
        onClick={submitEdit}
        className="bg-indigo-600 text-white py-2 rounded"
      >
        Save
      </button>
    </div>
  );
}
