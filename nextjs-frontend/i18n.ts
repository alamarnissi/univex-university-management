import {getRequestConfig} from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'fr', 'ar']

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./lib/messages/${locale}.json`)).default
  };
});