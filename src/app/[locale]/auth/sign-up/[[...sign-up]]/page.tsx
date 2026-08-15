import { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { constructNoIndexMetadata } from "@/src/lib/seo";

export const metadata: Metadata = constructNoIndexMetadata("Sign Up");

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
      <SignUp />
    </main>
  );
}
