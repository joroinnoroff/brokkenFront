import AllEvents from "@/components/AllEvents";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="px-8 pt-20 flex-1">
        <div className="container max-w-5xl mx-auto">
          <Link
            href="/"
            className="inline-block cursor-pointer hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
         

          <AllEvents />
        </div>
      </div>

      <Footer />
    </div>
  );
}
