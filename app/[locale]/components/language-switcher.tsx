'use client'

import { useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"

const languages = [
  { code: 'en', name: 'English' },
  { code: 'lt', name: 'Lietuvių' },
  { code: 'ru', name: 'Русский' }
]

export function LanguageSwitcher({ locale }: { locale: string }) {
  const t = useTranslations()

  const handleLanguageChange = (newLocale: string) => {
    const path = window.location.pathname
    const newPath = path.replace(`/${locale}`, `/${newLocale}`)
    window.location.href = newPath
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('nav.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={locale === lang.code ? "bg-muted" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 