import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'

export default withAuth(
    async function middleware(req: NextRequest) {
        const pathname = req.nextUrl.pathname

        // Manage route protection
        const isAuth = await getToken({req})
        const isLoginPage = pathname.startsWith('/login')

        const sensitiveRoutes = ['/dashboard']
        const isSensitiveRoute = sensitiveRoutes.some(route => pathname.startsWith(route))

        if (isLoginPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL('/dashboard', req.url))
            }

            return NextResponse.next()
        }

        if (!isAuth && isSensitiveRoute) {
            return NextResponse.redirect(new URL('/login', req.url))
        }
        if (pathname === '/') {
            return NextResponse.redirect(new URL('/d', req.url))
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            async authorized() {
                return true
            }
        }
    }
)

export const config = {
    matcher: ['/', '/login', '/dashboard/:path*'],
}