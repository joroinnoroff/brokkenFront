import Link from "next/link";

const MADE_BY_URL = "#";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-auto">
      <div className="container max-w-5xl mx-auto px-8 py-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Brokken Records</h3>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-gray-500">
          <span>Accepts payment with Stripe</span>
          <Link
            href="/terms"
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            Terms & Privacy
          </Link>
          <Link
            href={MADE_BY_URL}
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            Made by Oino
          </Link>
        </div>
      </div>
    </footer>
  );
}
