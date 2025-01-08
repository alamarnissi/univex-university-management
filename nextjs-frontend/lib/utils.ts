import { type ClassValue, clsx } from "clsx"
import { JWT } from "next-auth/jwt";
import { twMerge } from "tailwind-merge"
import { FetchRefreshJWT } from "./fetch/Auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
  return str;
}

export const getValidSubdomain = (host?: string | null) => {
  let subdomain: string | null = null;
  const invalidTLDs = ['space', 'com', 'org', 'net', 'tn'];
  const isProduction = process.env.NODE_ENV === 'production';

  if (!host && typeof window !== 'undefined') {
    // On client side, get the host from window
    host = window.location.host;
  }
  if (host && host.includes('.')) {
    const parts = host.split('.');

    // Check if in production environment and only two parts in the host
    if (isProduction && parts.length === 2) {
      return null;
    }

    if (parts.length === 2 && invalidTLDs.includes(parts[1])) {
      return null;
    }

    const workspace = parts[0];

    if (workspace && !workspace.includes('localhost')) {
      // Valid workspace
      subdomain = workspace;
    }
  }
  return subdomain;
};

export const removeLocaleFromPath = (pathname: string) => {
  const locales = ["en", "fr", "ar"];
  const parts = pathname.split('/');
  if (locales.includes(parts[1])) {
    parts.splice(1, 1);
  }
  return parts.join('/');
};

export async function refreshAccessToken(tokenObject: JWT) {
  try {
    // Get a new set of tokens with a refreshToken
    const tokenResponse = await FetchRefreshJWT(tokenObject);

    return {
      ...tokenObject,
      accessToken: tokenResponse?.data?.access_token,
      accessTokenExpiry: tokenResponse?.data?.accessTokenExpiry,
      refreshToken: tokenResponse?.data?.refresh_token,
    }
  } catch (error) {
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError",
    }
  }
}

export function getPathWithSubdomain(subdomain: string) {
  // Get the base URL from the environment variable
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  // Construct the new URL by inserting the subdomain
  const newUrl = baseUrl!.replace('://', `://${subdomain}.`)

  return newUrl;
}

export function generateSimilarBusinessNames(name: string, count = 3) {
  const suggestions: string[] = [];
  
  while (suggestions.length < count) {
    const randomNumber = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 9999
    const suggestion = `${name}${randomNumber}`;
    
    // Ensure the suggestion is unique
    if (!suggestions.includes(suggestion)) {
      suggestions.push(suggestion);
    }
  }

  return suggestions;
}