import { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { constructNoIndexMetadata } from "@/src/lib/seo";

export const metadata: Metadata = constructNoIndexMetadata("Sign In");

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
      <SignIn />
    </main>
  );
}
