"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import { useDebouncedCallback } from 'use-debounce'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('forms')

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }
    router.push(`?${params.toString()}`)
  }, 300)

  return (
    <Input
      className="max-w-sm"
      placeholder={t('search')}
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get('query') ?? ''}
    />
  )
}

