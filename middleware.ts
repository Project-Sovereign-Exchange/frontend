import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseCookies(cookieHeader: string | null): Record<string, string> {
    if (!cookieHeader) return {};

    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach(cookie => {
        const [name, ...rest] = cookie.trim().split('=');
        if (name && rest.length > 0) {
            cookies[name] = rest.join('=');
        }
    });
    return cookies;
}

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const rawCookieHeader = request.headers.get('cookie');
    const cookies = parseCookies(rawCookieHeader);
    const authToken = cookies['auth_token'];

    console.log('Raw cookies:', rawCookieHeader);
    console.log('Parsed cookies:', cookies);
    console.log('Auth token found:', !!authToken);

    switch(pathname) {
        case '/auth/login': {
            if (authToken) {
                return NextResponse.redirect(new URL('/', request.url));
            }
            return NextResponse.next();
        }
        case '/auth/register': {
            if (authToken) {
                return NextResponse.redirect(new URL('/', request.url));
            }
            return NextResponse.next();
        }
        case '/admin/login': {
            if (authToken) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
            return NextResponse.next();
        }
    }

    if (!authToken) {
        /*
        if (pathname.startsWith('/admin')) {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        } else {
            const loginUrl = new URL('/auth/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
         */
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Validate the auth token
    try {
        const payload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString());
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp < now) {
            const response = NextResponse.redirect(new URL('/auth/login', request.url));
            response.cookies.delete('auth_token');
            return response;
        }

        if (payload.purpose !== 'access') {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    } catch (error) {
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('auth_token');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    //matcher: ['/auth/:path*', '/admin/:path*'],
    matcher: ['/auth/:path*'],
};