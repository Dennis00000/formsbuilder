"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (term) {
      params.set("query", term)
    } else {
      params.delete("query")
    }
    params.set("page", "1")

    startTransition(() => {
      router.push(`/forms?${params.toString()}`)
    })
  }, 300)

  return (
    <div className="relative flex-1 max-w-2xl">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search forms..."
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-8"
      />
      {isPending && (
        <div className="absolute right-2.5 top-2.5">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
        </div>
      )}
    </div>
  )
}

