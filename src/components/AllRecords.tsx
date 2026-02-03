"use client";

import { fetchRecords, type RecordType } from "@/lib/api";
import { getCart, setCart, CART_UPDATED_EVENT } from "@/lib/cart";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function AllRecords() {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [cartIds, setCartIds] = useState<Set<number>>(new Set());
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  function refreshCartIds() {
    const cart = getCart();
    setCartIds(new Set(cart.map((i) => i.id)));
  }

  useEffect(() => {
    fetchRecords().then(setRecords).catch(console.error);
  }, []);

  useEffect(() => {
    refreshCartIds();
    const handler = () => refreshCartIds();
    window.addEventListener(CART_UPDATED_EVENT, handler);
    return () => window.removeEventListener(CART_UPDATED_EVENT, handler);
  }, []);

  const genres = Array.from(
    new Set(records.flatMap((r) => r.genre ?? []))
  ).sort();
  const filteredRecords =
    selectedGenre === ""
      ? records
      : records.filter((r) => r.genre?.includes(selectedGenre));

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

  return (
    <div className="w-full h-full">
      {/* Genre filter */}
      {genres.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Filter by type:</span>
          <button
            type="button"
            onClick={() => setSelectedGenre("")}
            className={`rounded-full px-3 py-1 text-sm ${
              selectedGenre === ""
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setSelectedGenre(genre)}
              className={`rounded-full px-3 py-1 text-sm ${
                selectedGenre === genre
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      <span>({filteredRecords.length})</span>
      <div className="grid lg:grid-cols-2 items-center lg:justify-items-center">
        {filteredRecords.map((record, index) => {
          const inCart = record.id != null && cartIds.has(record.id);
          return (
            <div key={record.id ?? index} className="flex items-center gap-12 my-8">
              <div className="relative h-28 w-28 shrink-0">
                {record.image?.length ? (
                  <Image
                    src={record.image[0]}
                    alt={record.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="h-28 w-28 bg-gray-200" />
                )}
              </div>
              <div>
                <p className="text-xs font-light">
                  Released: {formatDate(record.release_date)}
                </p>
                {record.genre?.length ? (
                  <p className="text-xs font-light text-gray-500">
                    {record.genre.join(", ")}
                  </p>
                ) : null}
                <p className="font-light">{record.name}</p>
                <p className="mt-4">{formatPrice(record.price)}</p>
                <button
                  className="mt-2 rounded bg-black px-4 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
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
    </div>
  );
}
