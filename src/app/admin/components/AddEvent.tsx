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

interface EventData {
  name: string;
  image: string;
  start_date: string;
  end_date: string;
  location: string;


  description: string;
}

interface AddEventProps {
  onSubmit: (record: EventData) => void;
}

export default function AddEvent({ onSubmit }: AddEventProps) {
  const [formData, setFormData] = useState<EventData>({
    name: "",
    image: "",
    start_date: "",
    end_date: "",
    location: "",
    description: "",
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
    form.append("folder", "events");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
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

  const handleSubmit = () => {
    if (!formData.image) {
      alert("Please upload an image first!");
      return;
    }
    onSubmit(formData);
    setFormData({ name: "", image: "", start_date: "", end_date: "", location: "", description: "" });
  };

  return (
    <Dialog>
      <DialogTrigger>Create new Event</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>Fill in the fields to create a new event.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          <input type="file" onChange={handleFileChange} />
          {uploading && <p>Uploading...</p>}
          {formData.image && <p className="text-sm text-green-600">Uploaded successfully!</p>}


          <input type="location" name="location" value={formData.location} onChange={handleChange} />
          <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
          <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} />

          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
          <button onClick={handleSubmit} className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded">
            Add Record
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
