import { Metadata } from 'next';
import { Toaster } from "@/components/ui/toast/toaster";
import ThemeProvider from '@/components/providers/ThemeProvider';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

type LayoutProps = {
  children: React.ReactNode;
  params: any;
};

const locales = ['en', 'fr', 'ar'];

export const metadata: Metadata = {
  title: 'Univex | Manage your learning flow',
}

export default async function LocaleLayout({
  children,
  params
}: LayoutProps) {

  // Validate that the incoming `locale` parameter is a valid locale
  if (!locales.includes(params.locale as any)) notFound();

  let messages;

  try {
    messages = (await import(`@/lib/messages/${params.locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html dir={params.locale === 'ar' ? 'rtl' : 'ltr'} lang={params.locale} className='scroll-smooth'>
      <body className={`relative`}>
        <ThemeProvider>
          <NextIntlClientProvider locale={params.locale} messages={messages}>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
