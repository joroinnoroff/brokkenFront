"use client"

import React, { useState } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

function getCartUserIdFromCookie() {
  if (typeof document === "undefined") return "";

  const cookieName = "cartUserId";
  const cookies = document.cookie.split("; ").filter(Boolean);
  const existing = cookies.find((cookie) => cookie.startsWith(`${cookieName}=`));

  if (!existing) return "";

  return existing.split("=")[1];
}

export default function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (typeof window === "undefined") return;

    setError(null);
    setIsLoading(true);

    try {
      const userId = getCartUserIdFromCookie();
      if (!userId) {
        setError("Could not find cart user id.");
        setIsLoading(false);
        return;
      }

      const storageKey = `cart_${userId}`;
      const existing = window.localStorage.getItem(storageKey);
      const cart: CartItem[] = existing ? JSON.parse(existing) : [];

      if (!cart.length) {
        setError("Your cart is empty.");
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong starting checkout.");
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url as string;
      } else {
        setError("Missing checkout URL from server.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error starting checkout.");
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-8 space-y-2">

      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        className="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isLoading ? "Sending to checkout..." : "Go to checkout"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

