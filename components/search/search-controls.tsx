"use client"

import { SearchBar } from "./search-bar"
import { Filters } from "./filters"

export default function SearchControls() {
  return (
    <div className="flex items-center gap-4">
      <SearchBar />
      <Filters />
    </div>
  )
}

