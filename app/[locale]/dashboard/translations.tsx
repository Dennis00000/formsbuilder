'use client'

import { useTranslations } from 'next-intl'

export function useServerTranslations() {
  return useTranslations()
}

export function getT() {
  return useServerTranslations()
} 