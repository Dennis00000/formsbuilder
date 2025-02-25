import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales } from './config'

const publicPages = ['/', '/login', '/signup'];

const middleware = createMiddleware({
  locales,
  defaultLocale: 'en'
});

export default async function middlewareHandler(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const path = req.nextUrl.pathname

  // Check if it's a public page or user is authenticated
  if (!session && !publicPages.includes(path) && !path.startsWith('/_next')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return middleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}

