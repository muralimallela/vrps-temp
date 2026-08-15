"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
      <SignIn />
    </main>
  );
}

