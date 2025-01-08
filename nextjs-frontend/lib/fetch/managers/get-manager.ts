import "server-only"

export const getUserData = async ({ token }: { token: string }) => {
    const res = await fetch(process.env.NEXT_PUBLIC_AUTH_API_URL+"/v1/users/profile",
        {
            mode: "cors",
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8",
                "Authorization": "Bearer " + token
            }
        }
    )
    const response = res.json();
    return response;
}