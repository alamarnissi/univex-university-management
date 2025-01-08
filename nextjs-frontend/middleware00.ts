import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { localePrefix, locales } from './lib/navigation';

// const locales = ['en', 'fr', 'ar'];
const publicPages = [
  '/',
  '/app/([^\/]+)/login/([^\/]+)',
  '/app/([^\/]+)/forget-password/([^\/]+)',
  '/api/:path'
];

const intlMiddleware = createIntlMiddleware({
  defaultLocale: 'en',
  locales,
  localePrefix,
},
);

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  function onSuccess(req) {

    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null
    },
    pages: {
      signIn: '/?modalopen=login'
    }
  }
);

export default async function middleware(req: NextRequest) {
  // const publicPathnameRegex = RegExp(
  //   `^(/(${locales.join('|')}))?(${publicPages.join('|')})?/?$`,
  //   'i'
  // );
  const url = req.nextUrl;

  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  );
  let isPublicPage = publicPathnameRegex.test(url.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
}

// export const config = {
//   matcher: [
//     '/((?!api|_next|.*\\..*).*)',
//     `/(${locales.join('|')})?/app/:domain/dashboard`,
//     `/(${locales.join('|')})?/app/:domain/academy`,
//   ]
// };