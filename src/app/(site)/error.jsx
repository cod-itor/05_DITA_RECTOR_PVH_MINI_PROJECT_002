"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Site route error:", error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center px-4">
      <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-red-700">Page failed to load</h2>
        <p className="mt-2 text-sm text-red-600">
          Something went wrong while rendering this page.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Retry
          </button>
          <Link
            href="/dashboard"
            className="rounded-full border border-red-300 bg-white px-5 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
