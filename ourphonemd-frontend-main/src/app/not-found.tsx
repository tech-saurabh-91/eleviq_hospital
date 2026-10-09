
import Link from "next/link";
import { ArrowLeft, ArrowRight, Home, Search, Stethoscope } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-b from-teal-50 via-white to-slate-50 px-4 py-16">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        {/* Brand-themed icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-xl shadow-teal-600/20">
          <Stethoscope className="h-10 w-10" strokeWidth={1.8} />
        </div>

        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm">
          <Search className="h-4 w-4" />
          Page not found
        </p>

        <h1 className="text-7xl font-extrabold tracking-tight text-slate-900 sm:text-8xl md:text-9xl">
          4<span className="bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">0</span>4
        </h1>

        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Oops! This page is missing.
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
          The page you are looking for may have moved, been removed,
          or the link may be incorrect. Let&apos;s get you back to
          your healthcare journey.
        </p>

        {/* Actions */}
        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-600 px-7 py-3 font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            <Home className="h-5 w-5" />
            Back to Home
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-7 py-3 font-semibold text-teal-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            Contact Us
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {/* Quick navigation */}
        <div className="mt-12 border-t border-slate-200/80 pt-7">
          <p className="mb-4 text-sm font-medium text-slate-500">
            Or explore these pages
          </p>

          <nav
            aria-label="Helpful pages"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium"
          >
            <Link
              href="/about"
              className="text-slate-600 transition-colors hover:text-teal-700"
            >
              About Us
            </Link>
            <Link
              href="/services"
              className="text-slate-600 transition-colors hover:text-teal-700"
            >
              Our Services
            </Link>
            <Link
              href="/contact"
              className="text-slate-600 transition-colors hover:text-teal-700"
            >
              Contact
            </Link>
          </nav>
        </div>

        <p className="mt-8 text-xs text-slate-400">
          Eleviq Hospital · Here to help you find your way.
        </p>
      </div>
    </main>
  );
}
