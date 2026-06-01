"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Admin route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center border border-amber-200">
        <div className="mb-4 text-4xl">⚠️</div>
        <h1 className="text-2xl font-bold text-amber-950 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-2">
          An error occurred while loading the admin page.
        </p>
        {error.message && (
          <p className="text-sm text-gray-500 mb-6 font-mono bg-gray-100 p-2 rounded">
            {error.message}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="bg-amber-900 hover:bg-amber-950 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
