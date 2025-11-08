import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "VRPS | Vaddera Reservation Porata Samithi | వడ్డెర రిజర్వేషన్ పోరాట సమితి",
  description:
    "Vaddera is an Indian ethnic community native to Telangana, Karnataka, Andhra Pradesh, Tamil Nadu, Maharashtra, Gujarat, Western Orissa and other states in India.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
