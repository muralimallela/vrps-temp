"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import LogoLoader from "@/src/components/loading/LogoLoader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const body = await res.json();
        if (body.success) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch {
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <LogoLoader message="Verifying access..." />;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center border border-amber-200">
          <div className="mb-4 text-4xl">🔒</div>
          <h1 className="text-2xl font-bold text-amber-950 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You do not have permission to access the admin panel. Admin access
            is required.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-amber-900 hover:bg-amber-950 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
