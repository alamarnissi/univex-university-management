import createIntlMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'

const locales = ['en', 'fr', 'ar'];

export default async function i18nMiddleware(request: NextRequest) {

  const handleI18nRouting = createIntlMiddleware({
    locales,
    defaultLocale: 'en',
  })

  const response = handleI18nRouting(request)

  // response.headers.set('X-NEXT-INTL-LOCALE', 'en')
  return response
}