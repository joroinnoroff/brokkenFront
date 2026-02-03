import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-3xl font-bold">Payment successful</h1>
      <p className="mb-8 text-sm text-gray-600">
        Thank you for your order. You can return to the records page to keep browsing.
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

