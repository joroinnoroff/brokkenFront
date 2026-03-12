"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Camera, Upload } from "lucide-react";
import { resolveImageUrl } from "@/lib/utils";

type Availability = "Available" | "Sold";

interface RecordData {
  name: string;
  image: string[];
  release_date: string;
  price: number;
  description: string;
  genre?: string[];
  availability?: Availability;
}

interface AddRecordProps {
  onSubmit: (record: RecordData) => void;
}

export default function AddRecord({ onSubmit }: AddRecordProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<RecordData>({
    name: "",
    image: [],
    release_date: "",
    price: 0,
    description: "",
    genre: [],
    availability: "Available",
  });
  const [genreInput, setGenreInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "price" ? Number(value) : value }));
  };

  const uploadFile = async (file: File) => {
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    await uploadFile(e.target.files[0]);
    e.target.value = "";
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      streamRef.current = stream;
      setCameraOpen(true);
    } catch (err) {
      console.error(err);
      setCameraError("Could not access camera. Check permissions or try uploading instead.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
    setCameraError(null);
  };

  useEffect(() => {
    if (!cameraOpen || !videoRef.current || !streamRef.current) return;
    videoRef.current.srcObject = streamRef.current;
    videoRef.current.play().catch(console.error);
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [cameraOpen]);

  const capturePhoto = async () => {
    const video = videoRef.current;
    if (!video || !video.srcObject || !video.videoWidth) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        stopCamera();
        await uploadFile(new File([blob], "capture.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.9
    );
  };

  const handleSubmit = () => {
    if (!formData.image?.length) {
      alert("Please upload an image first!");
      return;
    }
    const genre = genreInput
      ? genreInput.split(",").map((g) => g.trim()).filter(Boolean)
      : [];
    onSubmit({ ...formData, genre, availability: formData.availability ?? "Available" });
    setFormData({ name: "", image: [], release_date: "", price: 0, description: "", genre: [], availability: "Available" });
    setGenreInput("");
    setDialogOpen(false);
  };

  const inputClass =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black";

  const handleOpenChange = (open: boolean) => {
    if (!open) stopCamera();
    setDialogOpen(open);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 cursor-pointer">
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
            <div className="flex gap-2 mb-2">
              <label className="flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 cursor-pointer">
                <Upload className="h-4 w-4" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={startCamera}
                disabled={uploading}
                className="flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 cursor-pointer disabled:opacity-50"
              >
                <Camera className="h-4 w-4" />
                Take photo
              </button>
            </div>
            {cameraError && (
              <p className="text-sm text-red-500 mb-2">{cameraError}</p>
            )}
            {cameraOpen && (
              <div className="mb-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-h-48 rounded object-cover"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 cursor-pointer"
                  >
                    Capture
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
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
            <label className="mb-1 block text-sm font-medium">Availability</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, availability: "Available" }))
                }
                className={`rounded px-3 py-1.5 text-sm font-medium ${
                  formData.availability !== "Sold"
                    ? "bg-black text-white"
                    : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
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
                  formData.availability === "Sold"
                    ? "bg-black text-white"
                    : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Sold
              </button>
            </div>
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
