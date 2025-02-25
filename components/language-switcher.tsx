"use client"

import { usePathname, useRouter } from "next/navigation"
import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLocale } from "next-intl"
import { locales } from "@/config"

const languageNames = {
  en: "English",
  lt: "Lietuvių",
  ru: "Русский",
}

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()

  const handleLanguageChange = (locale: string) => {
    // Get the current path segments
    const segments = pathname.split("/")
    // Replace the locale segment (first segment after leading slash)
    segments[1] = locale
    // Reconstruct the path
    const newPath = segments.join("/")
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={currentLocale === locale ? "bg-accent" : ""}
          >
            {languageNames[locale as keyof typeof languageNames]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

