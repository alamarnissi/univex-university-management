"use server"

import { cookies } from "next/headers"

export async function updateCookie(name: string, value: string) {
    cookies().delete(name);

    cookies().set({
        name: name,
        value: value,
        httpOnly: false,
        path: '/'
    })
}