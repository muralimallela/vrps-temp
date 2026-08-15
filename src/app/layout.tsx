import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { SITE_URL, SITE_NAME_TE, SEO_PAGE_DATA } from "@/src/lib/seo";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6A160A",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO_PAGE_DATA.home.te.title,
    template: "%s | VRPS",
  },
  description: SEO_PAGE_DATA.home.te.description,
  keywords: SEO_PAGE_DATA.home.te.keywords,
  authors: [{ name: "VRPS Leadership Council", url: SITE_URL }],
  creator: "Vaddera Reservation Porata Samithi",
  publisher: "Vaddera Reservation Porata Samithi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/VRPS-LOGO-FINAL.png",
  },
  openGraph: {
    title: SEO_PAGE_DATA.home.te.title,
    description: SEO_PAGE_DATA.home.te.description,
    url: SITE_URL,
    siteName: SITE_NAME_TE,
    locale: "te_IN",
    alternateLocale: ["en_US"],
    type: "website",
    images: [
      {
        url: `${SITE_URL}/VRPS-LOGO-FINAL.png`,
        width: 1200,
        height: 630,
        alt: "VRPS - Vaddera Reservation Porata Samithi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_PAGE_DATA.home.te.title,
    description: SEO_PAGE_DATA.home.te.description,
    images: [`${SITE_URL}/VRPS-LOGO-FINAL.png`],
    creator: "@VRPS_Official",
    site: "@VRPS_Official",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="te" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
