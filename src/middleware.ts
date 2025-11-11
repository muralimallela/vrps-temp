// src/middleware.ts
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { clerkMiddleware } from '@clerk/nextjs/server';

// 1) Configure your supported locales and default. Edit as needed.
const intlMiddleware = createIntlMiddleware({
    // Add the locales your app supports
    locales: ['te', 'en'],
    defaultLocale: 'te',
    localeDetection: true,
    // Optional: you can add localeDetection: true|false (defaults to true)
});

// 2) Create the Clerk middleware handler
const clerkHandler = clerkMiddleware();

/**
 * Combined middleware:
 * - run next-intl first (so locale is set / redirect happens if needed)
 * - then run Clerk middleware
 *
 * Both middlewares may return a NextResponse (redirects / rewrites). If neither
 * returns a response, we call `NextResponse.next()` to continue the chain.
 */
export default function middleware(req: NextRequest, event: NextFetchEvent) {
    if (!req.cookies.get('NEXT_LOCALE')) {
        req.cookies.set('NEXT_LOCALE', 'te');
    }


    // next-intl may return a response (redirect to locale-prefixed URL for example)
    const intlRes = intlMiddleware(req);
    if (intlRes) return intlRes;

    // clerkMiddleware may return a response (auth redirects, etc.)
    const clerkRes = clerkHandler(req, event);
    if (clerkRes) return clerkRes;

    // No middleware produced a response, continue normally
    return NextResponse.next();
}

/**
 * Matcher:
 * - kept your existing rules (skip _next and static files, always run for api/trpc)
 * - next-intl expects the site routes to be matched too; we merge in the original pattern
 *
 * If you want next-intl to handle different matcher behavior (for example: only
 * public pages but not api), update the matcher accordingly.
 */
export const config = {
    matcher: [
        '/((?!api|_next|.*\\..*).*)',
    ],
};
