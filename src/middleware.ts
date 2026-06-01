import createIntlMiddleware from "next-intl/middleware";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware({
  locales: ["te", "en"],
  defaultLocale: "te",
  localeDetection: true,
});

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check admin route protection - redirect unauthenticated users
  const pathname = req.nextUrl.pathname;
  const adminRouteMatch = pathname.match(/^\/(te|en)\/admin/);

  if (adminRouteMatch) {
    const { userId } = await auth();

    // Redirect unauthenticated users to sign-in
    if (!userId) {
      const locale = adminRouteMatch[1];
      const signInUrl = new URL(`/${locale}/auth/sign-in`, req.url);
      signInUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(signInUrl);
    }
    // Authenticated users continue - role check happens in admin layout & API endpoints
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
