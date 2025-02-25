import type React from "react"
import { Suspense } from "react"
import { Inter } from "next/font/google"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { NextIntlClientProvider } from "next-intl"
import { ThemeProvider } from "next-themes"
import { NavBarWrapper } from "@/components/nav-bar-wrapper"
import { Toaster } from "@/components/ui/toaster"
import { locales } from "@/config"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages(locale)
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem 
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-background">
              <NavBarWrapper user={session?.user ?? null} />
              <Suspense fallback={<LoadingSpinner />}>
                {children}
              </Suspense>
              <Toaster />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

