import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { COOKIE_NAME } from "@/lib/auth"

const protectedRoutes = ["/dashboard", "/settings", "/onboarding"]
const adminRoutes = ["/admin"]
const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"]

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? "")
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))
  const isAdmin = adminRoutes.some((r) => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))

  let payload: { sub: string; role: string } | null = null

  if (token) {
    try {
      const { payload: p } = await jwtVerify(token, getSecret())
      payload = p as { sub: string; role: string }
    } catch {
      // Token invalid or expired — treated as unauthenticated
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && payload) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Protect user routes
  if (isProtected && !payload) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin-only routes
  if (isAdmin) {
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  // Exclude API routes, Next.js internals, and static files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
