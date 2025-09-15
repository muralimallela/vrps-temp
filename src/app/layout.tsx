import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Navbar } from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

export const metadata: Metadata = {
  title:
    "VRPS | Vaddera Reservaion Porata Samithi | వడ్డెర రిజర్వేషన్ పోరాట సమితి",
  description:
    "Vaddera is an Indian ethnic community native to Telangana, Karnataka, Andhra Pradesh, Tamil Nadu, Maharashtra, Gujarat, Western Orissa and other states in India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="canonical" href="/" />
        </head>
        <body>
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
