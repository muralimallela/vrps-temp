import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { Navbar } from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { Roboto, NTR, Noto_Sans } from "next/font/google";
import { getLocale, getMessages } from "next-intl/server";
import FloatingIcons from "@/src/components/SocialLink";
import ScrollToTop from "@/src/components/ScrollToTop";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-english",
});

const ntr = NTR({
  subsets: ["telugu"],
  weight: ["400"],
  variable: "--font-telugu",
});

export default async function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  if (!locale) notFound();

  const messages = await getMessages();

  const currentFont =
    locale === "te"
      ? `${ntr.variable} ${ntr.className}`
      : `${notoSans.variable} ${notoSans.className}`;

  return (
    <html lang={locale} className={currentFont}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <FloatingIcons/>
          {children}
          <Footer />
          <ScrollToTop/>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
