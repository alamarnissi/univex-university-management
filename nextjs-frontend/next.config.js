
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin(
    './i18n.ts',
);

/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
            }
        ],
        minimumCacheTTL: 1500000,
    },
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "false" },
                    { key: "Access-Control-Allow-Origin", value: "https://univex-cm-europe-west8-buwq3s6j3a-oc.a.run.app/api" },
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date" },
                ]
            },
            // {
            //     source: '/(.*)',
            //     headers: [
            //         {
            //             key: 'Content-Security-Policy',
            //             value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'",
            //         },
            //     ],
            // },
        ]
    }
}

module.exports = withNextIntl(nextConfig);
