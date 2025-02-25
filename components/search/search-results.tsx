"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { searchForms } from "@/lib/db"
import type { Form } from "@/lib/db"
import { LoadingSpinner } from "../ui/loading-spinner"
import { Pagination } from "./pagination"

export function SearchResults({
  searchParams,
}: {
  searchParams: { query?: string; page?: string; sort?: string }
}) {
  const [loading, setLoading] = useState(true)
  const [forms, setForms] = useState<Form[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true)
      try {
        const page = Number.parseInt(searchParams.page ?? "1")
        const query = searchParams.query ?? ""
        const sortBy = searchParams.sort ?? "newest"

        const result = await searchForms({
          query,
          page,
          sortBy: sortBy as any,
          isPublic: true,
          limit: 12,
        })

        setForms(result.forms)
        setTotalPages(result.totalPages)
        setCurrentPage(result.currentPage)
      } catch (error) {
        console.error("Error fetching forms:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchForms()
  }, [searchParams])

  if (loading) {
    return <LoadingSpinner />
  }

  if (forms.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No forms found. Try adjusting your search.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms.map((form) => (
          <Card key={form.id} className="cursor-pointer hover:bg-accent transition-colors">
            <CardContent className="p-6">
              <div className="aspect-video bg-muted rounded-md mb-2" />
              <h3 className="font-medium">{form.title}</h3>
              <p className="text-sm text-muted-foreground">
                By {form.user.email} • {form.likes?.[0]?.count ?? 0} likes • {form.responses?.[0]?.count ?? 0} responses
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}

