"use client"

import AllRecords from '@/components/AllRecords'
import CheckoutButton from '@/components/CheckoutButton'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'

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
  useEffect(() => {
    ensureCartUserIdCookie();
  }, []);

  return (
    <div className='min-h-screen w-full'>

      <div className='px-8 pt-20'>
        <Link href={"/"} className=''><ArrowLeft /></Link>
        <h1 className='text-3xl font-bold my-8'>All records</h1>


        <div className="container">
          <AllRecords />
          <CheckoutButton />
        </div>

      </div>
    </div>
  )
}
