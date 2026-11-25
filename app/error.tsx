"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section
      className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 text-center"
      role="alert"
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 border border-rose-100">
        <AlertTriangle className="w-8 h-8" aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
        Something went wrong
      </h1>
      <p className="text-gray-600 max-w-md mb-8 text-sm leading-relaxed">
        {error.message || "An unexpected error occurred while loading this view."}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
}
