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


interface RecordData {
  name: string;
  image: string[];
  release_date: string;
  price: number;
  description: string;
}

interface AddRecordProps {
  onSubmit: (record: RecordData) => void;
}

export default function AddRecord({ onSubmit }: AddRecordProps) {
  const [formData, setFormData] = useState<RecordData>({
    name: "",
    image: [],
    release_date: "",
    price: 0,
    description: "",
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "price" ? Number(value) : value }));
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
      setFormData(prev => ({ ...prev, image: [...prev.image, data.url] }));
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
    setFormData({ name: "", image: [], release_date: "", price: 0, description: "" });
  };

  return (
    <Dialog>
      <DialogTrigger>Create new record</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Record</DialogTitle>
          <DialogDescription>Fill in the fields to create a new record.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          <input type="file" onChange={handleFileChange} />
          {uploading && <p>Uploading...</p>}
          {formData.image && formData.image.length &&
            <>
              <div className="grid grid-cols-3 h-32 w-32">

                <div className="flex w-52">
                  {formData.image.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
                      <Image src={img} alt={`upload-${idx}`} fill style={{ objectFit: "cover" }} />
                      <button
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          image: prev.image.filter((_, i) => i !== idx)
                        }))}
                        className="absolute  top-1 right-1 bg-black text-white text-xs px-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}


                </div>


              </div>
              <p className="text-sm text-green-600">Uploaded successfully!</p>
            </>
          }



          <input type="date" name="release_date" value={formData.release_date} onChange={handleChange} />
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
          <button onClick={handleSubmit} className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded">
            Add Record
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
