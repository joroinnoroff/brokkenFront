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

interface RecordData {
  name: string;
  image: string[];
  release_date: string;
  price: number;
  description: string;
  genre?: string[];
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
    genre: [],
  });
  const [genreInput, setGenreInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "price" ? Number(value) : value }));
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
    const genre = genreInput
      ? genreInput.split(",").map((g) => g.trim()).filter(Boolean)
      : [];
    onSubmit({ ...formData, genre });
    setFormData({ name: "", image: [], release_date: "", price: 0, description: "", genre: [] });
    setGenreInput("");
  };

  const inputClass =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black";

  return (
    <Dialog>
      <DialogTrigger className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50">
        Create new record
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Record</DialogTitle>
          <DialogDescription>Fill in the fields to create a new record.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Record name"
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
            <label className="mb-1 block text-sm font-medium">Genres</label>
            <input
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              className={inputClass}
              placeholder="Jazz, Electronic, Experimental (comma-separated)"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Release date</label>
            <input
              type="date"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Price (NOK)</label>
            <input
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              className={inputClass}
              placeholder="299"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`${inputClass} min-h-[80px] resize-y`}
              placeholder="Album or record description"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Add Record
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
