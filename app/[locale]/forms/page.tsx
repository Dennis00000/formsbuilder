import { Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { SearchBar } from "@/components/search/search-bar"
import { Filters } from "@/components/search/filters"
import { SearchResults } from "@/components/search/search-results"
import { useTranslations } from "next-intl"

export const dynamic = "force-dynamic"

export default function FormsPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string; sort?: string }
}) {
  const t = useTranslations("forms")

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <div className="flex items-center gap-4">
        <Suspense fallback={<LoadingSpinner />}>
          <SearchBar />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <Filters />
        </Suspense>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

