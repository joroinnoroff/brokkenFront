import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AddRecordProps {
  onSubmit: (record: { name: string; image: string; release_date: string; price: number, description: string }) => void;
}

export default function AddRecord({ onSubmit }: AddRecordProps) {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
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
      const data = await res.json();
      setFormData(prev => ({ ...prev, image: data.url })); // save S3 URL
    } catch (err) {
      console.error("Upload failed:", err);
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
    setFormData({ name: "", image: "", release_date: "", price: 0, description: "" })
  }

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
          {formData.image && <p className="text-sm text-green-600">Uploaded successfully!</p>}
          <input type="date" name="release_date" value={formData.release_date} onChange={handleChange} />
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
          <button onClick={handleSubmit} className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded">Add Record</button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
