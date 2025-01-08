import { cookies } from "next/headers";

export const deleteCookie = ({name}: {name: string}) => {
    // response.cookies.set(key, "", { expires: new Date(Date.now()) });
    cookies().set(name, '', { maxAge: 0 })
};

export const setCookie = ({name, value, httpOnly, path}: {name: string, value: string, httpOnly: boolean, path: string}) => {
    cookies().set({
        name, 
        value, 
        httpOnly,
        path
    })
}

