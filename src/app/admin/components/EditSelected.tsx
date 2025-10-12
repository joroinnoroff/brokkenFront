"use client";
import React, { useState } from "react";
import Image from "next/image";
import { RecordType, updateRecord } from "@/lib/api";

type EditSelectedProps = {
  item: RecordType;
};

export default function EditSelected({ item }: EditSelectedProps) {
  const [formData, setFormData] = useState<RecordType>(item);
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
      setFormData(prev => ({ ...prev, image: data.url }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleClearImage = () => setFormData(prev => ({ ...prev, image: "" }));

  const handleSubmit = async () => {
    // Format release_date before sending
    const payload: RecordType = {
      ...formData,
      release_date: formData.release_date?.split("T")[0] ?? "",
    };

    try {
      await updateRecord(item.id!, payload);
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

      {"release_date" in formData && (
        <input
          type="date"
          name="release_date"
          value={formatDate(formData.release_date)}
          onChange={handleChange}
          className="border px-2 py-1 w-full mt-2"
        />
      )}

      {/* Image preview / upload */}
      <div className="flex flex-col gap-2 mt-2">
        {formData.image && (
          <div className="relative h-32 w-32">
            <Image src={formData.image} alt={formData.name ?? ""} fill style={{ objectFit: "cover" }} />
            <button
              onClick={handleClearImage}
              className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded text-xs"
            >
              Clear
            </button>
          </div>
        )}
        <input type="file" onChange={handleFileChange} />
        {uploading && <p>Uploading...</p>}
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
