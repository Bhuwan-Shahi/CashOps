import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/api/register', '/api/auth']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // Redirect logged-in users away from login/register
  if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Redirect non-logged-in users to login
  if (!isLoggedIn && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
