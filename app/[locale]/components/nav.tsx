'use client'

import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Nav({ locale }: { locale: string }) {
  const t = useTranslations()
  const pathname = usePathname()

  const links = [
    { href: `/${locale}`, label: t("nav.home") },
    { href: `/${locale}/forms`, label: t("nav.publicForms") },
  ]

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center">
        <a href={`/${locale}`} className="mr-6 flex items-center space-x-2">
          <span className="font-bold">{t("home.subtitle")}</span>
        </a>
        <div className="flex gap-6">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
} 