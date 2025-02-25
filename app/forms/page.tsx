import { Suspense } from "react"
import { SearchBar } from "@/components/search/search-bar"
import { Filters } from "@/components/search/filters"
import { Pagination } from "@/components/search/pagination"
import { searchForms } from "@/lib/db"
import { createServerClient } from "@/lib/supabase-server"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface SearchPageProps {
  searchParams: {
    query?: string
    page?: string
    sort?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-4">
        <SearchBar />
        <Filters />
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const page = Number.parseInt(searchParams.page ?? "1")
  const query = searchParams.query ?? ""
  const sortBy = searchParams.sort ?? "newest"

  const { forms, totalPages, currentPage } = await searchForms({
    query,
    page,
    sortBy: sortBy as any,
    isPublic: true,
    limit: 12,
  })

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

