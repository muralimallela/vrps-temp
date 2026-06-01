"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
      <SignUp />
    </main>
  );
}

