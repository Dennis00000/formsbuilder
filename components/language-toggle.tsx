"use client"

import { usePathname, useRouter } from "next/navigation"
import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const languages = [
  { code: "en", name: "English" },
  { code: "lt", name: "Lietuvių" },
  { code: "ru", name: "Русский" },
]

export function LanguageToggle() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (locale: string) => {
    const currentPath = pathname
    const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${locale}`)
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
        {languages.map((lang) => (
          <DropdownMenuItem key={lang.code} onClick={() => handleLanguageChange(lang.code)}>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

