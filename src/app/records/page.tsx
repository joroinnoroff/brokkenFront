"use client";

import AllRecords from "@/components/AllRecords";
import CartModal from "@/components/CartModal";
import { getCartCount, CART_UPDATED_EVENT } from "@/lib/cart";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function ensureCartUserIdCookie() {
  if (typeof document === "undefined") return;
  const cookieName = "cartUserId";
  const cookies = document.cookie.split("; ").filter(Boolean);
  const existing = cookies.find((cookie) => cookie.startsWith(`${cookieName}=`));
  if (!existing) {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const oneYearInSeconds = 60 * 60 * 24 * 365;
    document.cookie = `${cookieName}=${id}; path=/; max-age=${oneYearInSeconds}`;
  }
}

export default function Page() {
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    ensureCartUserIdCookie();
  }, []);

  useEffect(() => {
    setCartCount(getCartCount());
    const handler = () => setCartCount(getCartCount());
    window.addEventListener(CART_UPDATED_EVENT, handler);
    return () => window.removeEventListener(CART_UPDATED_EVENT, handler);
  }, []);

  return (
    <div className="min-h-screen w-full">
      <div className="px-8 pt-20">
        <div className="flex items-center justify-between">
          <Link href="/" className="">
            <ArrowLeft />
          </Link>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart {cartCount > 0 ? `(${cartCount})` : ""}
          </button>
        </div>
        <h1 className="text-3xl font-bold my-8">All records</h1>

        <div className="container">
          <AllRecords />
        </div>
      </div>

      <CartModal open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
