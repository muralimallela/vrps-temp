import { MetadataRoute } from "next";
import { SITE_URL } from "@/src/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/admin/",
          "/api/",
          "/te/admin/",
          "/en/admin/",
          "/te/auth/",
          "/en/auth/",
          "/te/id-card",
          "/en/id-card",
          "/te/profile",
          "/en/profile",
          "/te/user-profile/",
          "/en/user-profile/",
          "/te/donations/history",
          "/en/donations/history",
          "/te/verify/",
          "/en/verify/",
          "/te/address",
          "/en/address",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: [
          "/admin/",
          "/api/",
          "/*/admin/",
          "/*/auth/",
          "/*/id-card",
          "/*/profile",
          "/*/user-profile/",
          "/*/donations/history",
          "/*/verify/",
          "/*/address",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
