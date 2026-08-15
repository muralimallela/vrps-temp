import React from "react";
import { SITE_URL, SITE_NAME_EN, SITE_NAME_TE } from "@/src/lib/seo";

export function OrganizationJsonLd({ locale = "te" }: { locale?: string }) {
  const isTelugu = locale === "te";
  const name = isTelugu ? SITE_NAME_TE : SITE_NAME_EN;
  const description = isTelugu
    ? "వడ్డెర రిజర్వేషన్ పోరాట సమితి (VRPS) - విద్య, రాజ్యాంగ హక్కులు, సంక్షేమం మరియు సమాజ వికాస సాధికారత అధికారిక వేదిక."
    : "Vaddera Reservation Porata Samithi (VRPS) - Official movement and organization dedicated to constitutional rights, education, youth welfare, and community empowerment.";

  const schema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name,
    alternateName: ["VRPS", "Vaddera Reservation Porata Samithi", "వడ్డెర రిజర్వేషన్ పోరాట సమితి"],
    url: SITE_URL,
    logo: `${SITE_URL}/VRPS-LOGO-FINAL.png`,
    image: `${SITE_URL}/VRPS-LOGO-FINAL.png`,
    description,
    foundingDate: "2000",
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: "Andhra Pradesh",
      },
      {
        "@type": "AdministrativeArea",
        name: "Telangana",
      },
      {
        "@type": "Country",
        name: "India",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Grievance Redressal & Public Support",
        email: "vaddera@gmail.com",
        telephone: "+91-9876543210",
        availableLanguage: ["Telugu", "English", "Hindi"],
      },
    ],
    sameAs: [
      "https://facebook.com",
      "https://instagram.com",
      "https://whatsapp.com",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd({ locale = "te" }: { locale?: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: locale === "te" ? SITE_NAME_TE : SITE_NAME_EN,
    alternateName: "VRPS Official Portal",
    url: `${SITE_URL}/${locale}`,
    inLanguage: locale === "te" ? "te-IN" : "en-US",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName = "VRPS Editorial Council",
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url.startsWith("http") ? url : `${SITE_URL}${url}`,
    },
    image: image
      ? image.startsWith("http")
        ? image
        : `${SITE_URL}${image}`
      : `${SITE_URL}/VRPS-LOGO-FINAL.png`,
    author: {
      "@type": "Organization",
      name: authorName,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Vaddera Reservation Porata Samithi (VRPS)",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/VRPS-LOGO-FINAL.png`,
      },
    },
    datePublished: datePublished || "2026-01-01T00:00:00+05:30",
    dateModified: dateModified || datePublished || "2026-08-01T00:00:00+05:30",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function AboutPageJsonLd({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: title,
    description,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    mainEntity: {
      "@type": "NGO",
      name: "Vaddera Reservation Porata Samithi",
      url: SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function CollectionPageJsonLd({
  title,
  description,
  url,
  itemCount,
}: {
  title: string;
  description: string;
  url: string;
  itemCount?: number;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    ...(itemCount !== undefined && { numberOfItems: itemCount }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
