import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 text-primary flex items-center justify-center mb-6 border border-orange-100">
        <Compass className="w-8 h-8" aria-hidden="true" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
        Destination Not Found
      </h1>
      <p className="text-gray-600 max-w-md mb-8 text-sm leading-relaxed">
        The page you are looking for does not exist or may have been moved. Let&apos;s get you back on track.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        Explore SkyTrip Home
      </Link>
    </section>
  );
}
