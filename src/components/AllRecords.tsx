"use client"

import { fetchRecords } from '@/lib/api';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

interface RecordType {
  id?: number;
  name: string;
  image: string[];
  release_date: string;
  price: number;
  description: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

function getOrCreateCartUserId() {
  if (typeof document === "undefined") return "";

  const cookieName = "cartUserId";
  const cookies = document.cookie.split("; ").filter(Boolean);
  const existing = cookies.find((cookie) => cookie.startsWith(`${cookieName}=`));

  if (existing) {
    return existing.split("=")[1];
  }

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const oneYearInSeconds = 60 * 60 * 24 * 365;
  document.cookie = `${cookieName}=${id}; path=/; max-age=${oneYearInSeconds}`;

  return id;
}

export default function AllRecords() {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [justAddedId, setJustAddedId] = useState<number | null>(null);

  useEffect(() => {
    fetchRecords().then(setRecords).catch(console.error);
  }, []);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("no-NO"); // Output: 10.10.2007
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("no-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 0
    }).format(price); // Output: 500 kr
  }

  function handleAddToCart(record: RecordType) {
    if (typeof window === "undefined") return;
    if (!record.id) return;

    const userId = getOrCreateCartUserId();
    if (!userId) return;

    const storageKey = `cart_${userId}`;
    const existing = window.localStorage.getItem(storageKey);
    let cart: CartItem[] = [];

    if (existing) {
      try {
        cart = JSON.parse(existing) as CartItem[];
      } catch {
        cart = [];
      }
    }

    const index = cart.findIndex((item) => item.id === record.id);

    if (index >= 0) {
      cart[index].quantity += 1;
    } else {
      cart.push({
        id: record.id,
        name: record.name,
        price: record.price,
        quantity: 1,
      });
    }

    window.localStorage.setItem(storageKey, JSON.stringify(cart));
    setJustAddedId(record.id);

    setTimeout(() => {
      setJustAddedId((current) => (current === record.id ? null : current));
    }, 1000);
  }

  return (
    <div className='w-full h-full  '>
      <span>({records.length})</span>
      <div className='grid   lg:grid-cols-2 items-center lg:justify-items-center'>
        {records.map((record, index) => (
          <div key={index} className='flex items-center gap-12 my-8'>
            <div className="relative h-28 w-28">
              {record.image && record.image.length > 0 ? (
                <Image
                  src={record.image[0]}
                  alt={record.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="h-12 w-12 bg-gray-200" />
              )}
            </div>
            <div>

              <p className='text-xs font-light'>Released: {formatDate(record.release_date)}</p>
              <p className='font-light'>{record.name}</p>
              <p className='mt-4'>{formatPrice(record.price)}</p>
              <button
                className='mt-2 rounded bg-black px-4 py-2 text-xs font-medium text-white'
                onClick={() => handleAddToCart(record)}
              >
                {record.id && justAddedId === record.id ? "Added" : "Add to cart"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
