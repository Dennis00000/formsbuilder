"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "mostLiked", label: "Most Liked" },
  { value: "mostResponses", label: "Most Responses" },
]

export function Filters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentSort = searchParams.get("sort") || "newest"

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)

    startTransition(() => {
      router.push(`/forms?${params.toString()}`)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[120px]">
            Sort By
            {isPending && <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={currentSort} onValueChange={handleSortChange}>
            {sortOptions.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

