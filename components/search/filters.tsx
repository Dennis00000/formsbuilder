"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTranslations } from 'next-intl'
import type { SortOption } from '@/lib/db'

export function Filters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('forms.filters.sort')

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', value)
    router.push(`?${params.toString()}`)
  }

  return (
    <Select defaultValue={searchParams.get('sort') ?? 'newest'} onValueChange={handleSort}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">{t('newest')}</SelectItem>
        <SelectItem value="oldest">{t('oldest')}</SelectItem>
        <SelectItem value="mostLiked">{t('mostLiked')}</SelectItem>
        <SelectItem value="mostResponses">{t('mostResponses')}</SelectItem>
      </SelectContent>
    </Select>
  )
}

