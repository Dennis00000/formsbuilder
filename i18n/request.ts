import { getRequestConfig } from 'next-intl/server'
import { locales } from '../i18n'
import { headers } from 'next/headers'

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default
}))

export async function requestLocale() {
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || '/'

  // Extract locale from pathname
  const segments = pathname.split('/')
  const locale = segments[1]

  // Check if it's a valid locale
  if (locales.includes(locale as any)) {
    return locale
  }

  return 'en'
} 