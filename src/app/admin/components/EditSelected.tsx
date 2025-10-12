"use client";
import React, { useState } from "react";
import Image from "next/image";
import { EventType, RecordType, updateRecord } from "@/lib/api";

interface EventData {
  id: number | string;
  name: string;
  image?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  description?: string;
}

interface RecordData {
  id: number | string;
  name: string;
  image?: string;
  release_date?: string;
  price?: number;
  description?: string;
}

type EditSelectedProps = {
  item: EventData | RecordData;
  isEvent: boolean;
};

export default function EditSelected({ item, isEvent }: EditSelectedProps) {
  const [formData, setFormData] = useState<EventData | RecordData>(item);


  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value, // TS might still warn slightly
    } as EventData | RecordData)); // cast back to correct type
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
      setFormData((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleClearImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async () => {
    type FormItem = RecordType | EventType;
    const updatedFields: Partial<FormItem> = {};

    (Object.keys(formData) as (keyof FormItem)[]).forEach((key) => {
      let finalValue: any = formData[key]; // temporary "any" here is fine inside TS type inference

      // Convert dates to YYYY-MM-DD
      if (["release_date", "start_date", "end_date"].includes(key as string) && typeof finalValue === "string") {
        finalValue = finalValue.split("T")[0];
      }

      // Convert price to number
      if (key === "price" && finalValue !== undefined && finalValue !== null && finalValue !== "") {
        finalValue = Number(finalValue);
      }

      const originalValue = item[key as keyof typeof item];
      if (finalValue !== originalValue) {
        updatedFields[key] = finalValue;
      }
    });

    if (!Object.keys(updatedFields).length) {
      alert("Nothing changed!");
      return;
    }

    try {
      await updateRecord(item.id as number, updatedFields);
      alert("Updated successfully!");
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Update failed";
      alert(message);
    }
  };





  const formatDateForInput = (date?: string) => {
    if (!date) return "";
    return date.split("T")[0]; // "YYYY-MM-DD"
  };


  return (
    <div className="mt-6 flex flex-col gap-3">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="border px-2 py-1 w-full"
        placeholder="Name"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="border px-2 py-1 w-full mt-2"
        placeholder="Description"
      />

      {isEvent ? (
        <>
          {"location" in formData && (
            <input
              name="location"
              value={formData.location ?? ""}
              onChange={handleChange}
              className="border px-2 py-1 w-full mt-2"
              placeholder="Location"
            />
          )}
          {"start_date" in formData && (
            <input
              type="date"
              name="start_date"
              value={formatDateForInput(formData.start_date) ?? ""}
              onChange={handleChange}
              className="border px-2 py-1 w-full mt-2"
            />
          )}
          {"end_date" in formData && (
            <input
              type="date"
              name="end_date"
              value={formatDateForInput(formData.end_date) ?? ""}
              onChange={handleChange}
              className="border px-2 py-1 w-full mt-2"
            />
          )}
        </>
      ) : (
        <>
          {"release_date" in formData && (
            <input
              type="date"
              name="release_date"
              value={formatDateForInput(formData.release_date) ?? ""}
              onChange={handleChange}
              className="border px-2 py-1 w-full mt-2"
            />
          )}
          {"price" in formData && (
            <input
              type="number"
              name="price"
              value={formData.price ?? ""}
              onChange={handleChange}
              className="border px-2 py-1 w-full mt-2"
              placeholder="Price"
            />
          )}
        </>
      )}


      {/* Image preview / upload */}
      <div className="flex flex-col gap-2 mt-2">
        {formData.image && (
          <div className="relative h-32 w-32">
            <Image src={formData.image} alt={formData.name} fill style={{ objectFit: "cover" }} />
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
