// Force dynamic rendering to avoid SSG React-dispatcher null bug (Windows
// path-casing creates duplicate React instances in the static-generation worker).
export const dynamic = "force-dynamic";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="max-w-md">
        <p className="text-8xl font-black text-[#620E87]/10 leading-none mb-2">
          404
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
          have moved or no longer exists.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#620E87] hover:bg-[#7d1aab] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
            aria-label="Return to homepage"
          >
            <Home className="size-4" aria-hidden="true" />
            Go to Homepage
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 border border-[#620E87] text-[#620E87] hover:bg-[#620E87] hover:text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
            aria-label="Contact our team"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
