import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";


export default function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;
    const loginUrl = new URL('/admin/login', request.url);

    if (pathname.startsWith('/admin')) {
        if (pathname === '/admin/login') {
            return NextResponse.next()
        }
    }

    const authToken = request.cookies.get('auth_token');

    if (!authToken) {
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        const payload = JSON.parse(Buffer.from(authToken.value.split('.')[1], 'base64').toString())
        const now = Math.floor(Date.now() / 1000)

        if (payload.exp < now) {
            const response = NextResponse.redirect(new URL('/admin/login', request.url))
            response.cookies.delete('auth_token')
            return response
        }

        // Check token purpose
        if (payload.purpose !== 'access') {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

    } catch (error) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*']
}