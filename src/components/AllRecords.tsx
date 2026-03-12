"use client";

import { fetchRecords, type RecordType } from "@/lib/api";
import { getCart, setCart, CART_UPDATED_EVENT } from "@/lib/cart";
import { resolveImageUrl } from "@/lib/utils";
import GenreFilter from "@/components/GenreFilter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function normalizeGenre(genre: unknown): string[] {
  if (Array.isArray(genre)) return genre.filter((g): g is string => typeof g === "string");
  if (typeof genre === "string" && genre.trim()) return [genre.trim()];
  return [];
}

export default function AllRecords() {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [cartIds, setCartIds] = useState<Set<number>>(new Set());
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [descriptionRecord, setDescriptionRecord] = useState<RecordType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  function refreshCartIds() {
    const cart = getCart();
    setCartIds(new Set(cart.map((i) => i.id)));
  }

  useEffect(() => {

    setLoading(true);
    fetchRecords().then(setRecords).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refreshCartIds();
    const handler = () => refreshCartIds();
    window.addEventListener(CART_UPDATED_EVENT, handler);
    return () => window.removeEventListener(CART_UPDATED_EVENT, handler);
  }, []);

  const availableRecords = records.filter(
    (r) => r.availability !== "Sold"
  );

  const filteredRecords =
    selectedGenre === ""
      ? availableRecords
      : availableRecords.filter((r) => normalizeGenre(r.genre).includes(selectedGenre));

  const displayedRecords = searchTerm.trim()
    ? filteredRecords.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      )
    : filteredRecords;

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("no-NO");
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("no-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 0,
    }).format(price);
  }

  function handleAddToCart(record: RecordType) {
    const id = record.id;
    if (typeof window === "undefined" || id == null || cartIds.has(id)) return;
    const cart = getCart();
    cart.push({
      id,
      name: record.name,
      price: record.price,
      quantity: 1,
    });
    setCart(cart);
    setCartIds((prev) => new Set(prev).add(id));
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-6 flex flex-wrap gap-2">
          <div className="h-8 w-16 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="relative mb-4 flex items-center gap-2">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="mb-4 h-4 w-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 my-8 animate-pulse">
              <div className="h-20 w-20 shrink-0 bg-gray-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-6 bg-gray-200 rounded w-1/3 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <GenreFilter
          records={availableRecords.map((r) => ({ ...r, genre: normalizeGenre(r.genre) }))}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
        />
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2 text-sm w-64 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 cursor-pointer transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <span className="text-sm text-gray-500">({displayedRecords.length})</span>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 items-center lg:justify-items-center w-full mx-auto gap-12">
        {displayedRecords.map((record, index) => {
          const inCart = record.id != null && cartIds.has(record.id);
          const imgSrc = record.image?.[0] ? resolveImageUrl(record.image[0]) : "";
          const genres = normalizeGenre(record.genre);
          return (
            <div key={record.id ?? index} className="flex items-center gap-12 my-8 w-full">
              <div className="relative h-20 w-20 shrink-0">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={record.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="h-20 w-20 bg-gray-200" />
                )}
              </div>
              <div className="flex-1 min-w-0 ">
              <p className="font-light mt-1">{record.name}</p>
                <div className="flex items-start justify-between gap-2">
                
                  <div>
                    <p className="text-xs font-light">
                      Released: {formatDate(record.release_date)}
                    </p>
                    {genres.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {genres.map((g) => (
                          <span
                            key={g}
                            className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    ) : null}
    
                  </div>
                  <button
                    type="button"
                    onClick={() => setDescriptionRecord(record)}
                    className={`shrink-0 rounded-full p-1.5 transition-colors cursor-pointer ${
                      record.description?.trim()
                        ? "text-gray-700 hover:bg-gray-200"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                    aria-label="View description"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 px-2">{formatPrice(record.price)}</p>
                <button
                  className="mt-2 rounded bg-black px-4 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-90 transition-opacity cursor-pointer"
                  onClick={() => handleAddToCart(record)}
                  disabled={inCart}
                >
                  {inCart ? "In cart" : "Add to cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!descriptionRecord} onOpenChange={(open) => !open && setDescriptionRecord(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{descriptionRecord?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {descriptionRecord?.description?.trim() || "No description available."}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
