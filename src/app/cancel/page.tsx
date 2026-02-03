import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-3xl font-bold">Checkout canceled</h1>
      <p className="mb-8 text-sm text-gray-600">
        Your payment was not completed. You can return to the records page to review your cart or keep browsing.
      </p>
      <Link
        href="/records"
        className="rounded bg-black px-4 py-2 text-sm font-medium text-white"
      >
        Back to records
      </Link>
    </div>
  );
}

