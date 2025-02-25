import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { locales } from "./config"

const publicPages = ["/", "/login", "/signup"]

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for static files, API routes, and _next
  if (pathname.includes("/_next") || pathname.includes("/api") || pathname.match(/\.(.*)$/)) {
    return NextResponse.next()
  }

  // Handle internationalization
  const intlMiddleware = createMiddleware({
    locales,
    defaultLocale: "en",
    localePrefix: "always",
  })

  const response = await intlMiddleware(request)

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}

