import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request) {
    // Get the pathname of the request
    const path = request.nextUrl.pathname;

    // Get auth status from cookies
    const isAuthenticated = request.cookies.has('authenticated');

    // Public paths that don't require authentication
    const isPublicPath = path === '/login' || path === '/signup';

    // If the user is on a public path and is already authenticated, redirect to home
    if (isPublicPath && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Let all other requests pass through
    return NextResponse.next();
}

// Configure the paths that this middleware should run on
export const config = {
    matcher: ['/login', '/signup'],
};