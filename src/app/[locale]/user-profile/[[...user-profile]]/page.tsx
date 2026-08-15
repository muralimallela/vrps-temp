import { Metadata } from "next";
import { UserProfile } from "@clerk/nextjs";
import { constructNoIndexMetadata } from "@/src/lib/seo";

export const metadata: Metadata = constructNoIndexMetadata("User Account Profile");

export default function UserProfilePage() {
  return (
    <main className="min-h-screen bg-amber-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#e4c69d] bg-white p-4 md:p-6 shadow-sm">
        <UserProfile />
      </div>
    </main>
  );
}
