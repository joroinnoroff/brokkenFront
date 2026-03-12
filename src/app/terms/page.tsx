import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="px-8 pt-20">
        <div className="container max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-block cursor-pointer hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold my-8">Terms & Privacy</h1>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Cookies</h2>
              <p className="text-sm leading-relaxed">
                We do not use cookies for tracking or analytics. A minimal cookie may be used
                solely for cart functionality to remember your selections during checkout.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Third party</h2>
              <p className="text-sm leading-relaxed">
                We do not use third-party tracking, analytics, or advertising services. We do
                not share your data with third parties except as required for payment
                processing.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Payment</h2>
              <p className="text-sm leading-relaxed">
                Payments are processed securely via Stripe. We do not store your card details.
                All payment data is handled by Stripe in accordance with their security
                standards.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
