import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { localePrefix, locales } from './lib/navigation';
import { getToken } from 'next-auth/jwt';
import { getValidSubdomain, removeLocaleFromPath } from './lib/utils';

// const locales = ['en', 'fr', 'ar'];
const publicPages = [
  '/',
  '/app/([^\/]+)/',
  '/app/([^\/]+)/login/([^\/]+)',
  '/app/([^\/]+)/forget-password/([^\/]+)',
  '/api/:path'
];

const staticFilePaths = [
  '/_next',
  '/static',
  '/images',
  '/favicon.ico'
];

const intlMiddleware = createIntlMiddleware({
  defaultLocale: 'en',
  locales,
  localePrefix,
},
);

const i18nMiddleware = async (req: NextRequest, response: NextResponse, defaultLocale: string, urlPath: string, subdomain: string | null, locale?: string) => {

  if (subdomain && subdomain !== null) {

    if (urlPath.startsWith("/api")) {
      return NextResponse.next();
    }

    const session = await getToken({ req });

    const rewritedPathname = `app/${subdomain}${urlPath}`;

    response.headers.set('x-default-locale', defaultLocale);
    const url = new URL(`/${locale ? locale : defaultLocale}/${rewritedPathname}`, req.url);

    response.headers.set('x-middleware-rewrite', url.toString());


    return response;
  }
  return response;
};

const authenticationMiddleware = async (req: NextRequest, defaultLocale: string, urlPath: string, subdomain: string | null, locale?: string) => {
  if (subdomain && subdomain !== null) {

    return (withAuth(
      // Note that this callback is only invoked if
      // the `authorized` callback has returned `true`
      // and not for pages listed in `pages`.
      async function onSuccess(req) {
        const response = intlMiddleware(req);

        const rewritedPathname = `app/${subdomain}${urlPath}`;
        if (urlPath.startsWith("/api")) {
          return NextResponse.next();
        }

        response.headers.set('x-default-locale', defaultLocale);
        const url = new URL(`/${locale ? locale : defaultLocale}/${rewritedPathname}`, req.url);

        response.headers.set('x-middleware-rewrite', url.toString());

        return response;
      },
      {
        callbacks: {
          authorized: ({ token }) => token != null
        },
        pages: {
          signIn: '/?modalopen=login'
        }
      }
    ) as any)(req);
  }

  return (authMiddleware as any)(req);
};

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
  const urlPath = removeLocaleFromPath(url.pathname);

  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  );
  let isPublicPage = publicPathnameRegex.test(url.pathname);

  // Check if the request targets static files
  const isStaticFile = staticFilePaths.some(path => url.pathname.startsWith(path));

  if (isStaticFile) {
    return NextResponse.next();
  }

  // Get hostname of request (e.g. demo.univex.com, demo.localhost:3000)
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_APP_URL}`);

  const searchParams = url.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  // const path = removeLocaleFromPath(`${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`);
  const locale = req.cookies.get('NEXT_LOCALE')?.value;
  const defaultLocale = req.headers.get('x-default-locale') || 'en';

  const allowedDomains = ["localhost:3000", "univex.space"];
  // Verify if hostname exist in allowed domains
  const isAllowedDomain = allowedDomains.some(domain => hostname.includes(domain));

  const subdomain = getValidSubdomain(hostname)

  if (subdomain) {
    const rewritedPathname = `/app/${subdomain}${urlPath}`;
    isPublicPage = publicPathnameRegex.test(rewritedPathname);
  }

  if (isPublicPage) {
    const response = intlMiddleware(req);
    return i18nMiddleware(req, response, defaultLocale, urlPath, subdomain, locale);
  } else {

    return authenticationMiddleware(req, defaultLocale, urlPath, subdomain, locale);
  }
}

// export const config = {
//   matcher: [
//     '/((?!api|_next|.*\\..*).*)',
//     `/(${locales.join('|')})?/app/:domain/dashboard`,
//     `/(${locales.join('|')})?/app/:domain/academy`,
//   ]
// };