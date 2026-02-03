"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getCart,
  setCart,
  getCartCount,
  getCartUserId,
  CART_UPDATED_EVENT,
  type CartItem,
} from "@/lib/cart";
import React, { useEffect, useState } from "react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("no-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
  }).format(price);
}

interface CartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartModal({ open, onOpenChange }: CartModalProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function refreshCart() {
    setItems(getCart());
  }

  useEffect(() => {
    if (open) refreshCart();
  }, [open]);

  useEffect(() => {
    const handler = () => refreshCart();
    window.addEventListener(CART_UPDATED_EVENT, handler);
    return () => window.removeEventListener(CART_UPDATED_EVENT, handler);
  }, []);

  function handleRemove(id: number) {
    const next = getCart().filter((item) => item.id !== id);
    setCart(next);
    setItems(next);
  }

  async function handleCheckout() {
    setError(null);
    setIsCheckingOut(true);
    try {
      const cart = getCart();
      if (!cart.length) {
        setError("Your cart is empty.");
        setIsCheckingOut(false);
        return;
      }
      const purchase_uuid = getCartUserId();
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, purchase_uuid }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong starting checkout.");
        setIsCheckingOut(false);
        return;
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url as string;
      } else {
        setError("Missing checkout URL from server.");
        setIsCheckingOut(false);
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error starting checkout.");
      setIsCheckingOut(false);
    }
  }

  const total = items.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cart ({getCartCount()})</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              <ul className="max-h-64 space-y-3 overflow-y-auto border-b pb-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-gray-500">{formatPrice(item.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="shrink-0 rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="font-medium">Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut || items.length === 0}
                className="w-full rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {isCheckingOut ? "Sending to checkout…" : "Go to checkout"}
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
