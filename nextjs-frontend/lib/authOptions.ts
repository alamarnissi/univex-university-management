import type { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials"
import { FetchLogin, checkEmailAfterGoogleConnect } from '@/lib/fetch/Auth';
import { deleteCookie, setCookie } from "./cookies";
import { decodeJWT } from "./token";
import { cookies } from "next/headers";
import { refreshAccessToken } from "./utils";
import { updateCookie } from "./actions/cookies.action";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_ID || '',
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET || '',
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            id: 'credentials',
            type: "credentials",
            name: 'univex',
            credentials: {
                email: {
                    label: 'email',
                    type: 'email',
                    placeholder: 'name@example.com',
                },
                password: { label: 'password', type: 'password' },
                workspace_subdomain: { label: 'workspace_subdomain', type: 'text' },
                type: { label: 'type', type: 'text' }
            },
            async authorize(credentials, req) {
                const payload = {
                    email: credentials?.email as string,
                    password: credentials?.password as string,
                    workspace_subdomain: credentials?.workspace_subdomain as string
                };
                const res = await FetchLogin(payload, credentials?.type as string)

                if (res?.status === 200) {
                    return res.data;
                }

                // Return null if user data could not be retrieved
                return null;
            },
        }),
    ],
    secret: process.env.JWT_SECRET_KEY,
    pages: {
        signIn: "/?modalopen=login"
    },
    callbacks: {
        redirect: async ({ url, baseUrl }) => {
            // const cookieStore = cookies();
            // const newUserFromGoogle = cookieStore.get("is_new_user");

            // if(url.includes("/dashboard") && newUserFromGoogle){
            //     return `${baseUrl}?modalopen=complete_register&email=${newUserFromGoogle?.value}`
            // }

            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl;
        },
        jwt: async ({ token, user, account, profile }) => {

            if (account) {
                setCookie({
                    name: 'access_token',
                    value: user?.access_token as unknown as string,
                    httpOnly: false,
                    path: '/'
                })

                token.accessToken = user?.access_token;
                token.refreshToken = user?.refresh_token;
                token.accessTokenExpiry = user?.accessTokenExpiry;

                return token;

            } else if (new Date(Date.now()) < new Date(token.accessTokenExpiry)) {

                return token;
            } else {
                if (!token.refreshToken) throw new Error("Missing refresh token")

                // If the call arrives after 23 hours have passed, we allow to refresh the token.
                token = await refreshAccessToken(token);
                updateCookie('access_token', token?.accessToken as string)

                return Promise.resolve(token);
            }
            

            // if (account && user) {
            //     if (account?.provider === "google") {
            //         if (profile?.email) {
            //             const res = await checkEmailAfterGoogleConnect(profile?.email);

            //             if (res.status == 200) {
            //                 const tokenCookie = res.data.access_token;
            //                 if (tokenCookie) {
            //                     setCookie({
            //                         name: 'access_token',
            //                         value: tokenCookie,
            //                         httpOnly: false,
            //                         path: '/'
            //                     })

            //                     return {
            //                         ...token,
            //                         accessToken: tokenCookie,
            //                         // refreshToken: user?.refresh_token,
            //                     };

            //                 }
            //             } else if (res.status == 404) {
            //                 // return res
            //                 deleteCookie({
            //                     name: 'access_token'
            //                 })
            //                 setCookie({
            //                     name: 'is_new_user',
            //                     value: profile?.email,
            //                     httpOnly: false,
            //                     path: '/'
            //                 })

            //                 // new URL(`?modalopen=complete_register&email=${profile?.email}`).toString
            //             }
            //         }
            //     } 
            // }

            // return token;
    },

    session: async ({ session, token }) => {

        if (token.accessToken) {
            const currentUser = await decodeJWT(token.accessToken);
            const { first_name, email, role, user_id, workspace_id } = currentUser;
            if (session.user != undefined) {
                session.user.email = email;
                session.user.name = first_name;
                session.user.workspace_id = workspace_id;
                session.user.role = role;
                session.user.id = user_id;
                session.user.subscribed = false;
                session.user.access_token = token.accessToken;
                session.user.accessTokenExpiry = token.accessTokenExpiry;
            }
        }

        return session;
    },
},
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 Days
    },
};