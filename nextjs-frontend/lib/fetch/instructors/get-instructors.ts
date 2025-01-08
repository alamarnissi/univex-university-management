import 'server-only'

export const getInstructorsData = async ({token}: {token: string}) => {
    const url = process.env.NEXT_PUBLIC_AUTH_API_URL + "/v1/instructors/list";

    const res = await fetch(url+ "?sort_instructor=most-recent", {
        mode: "cors",
        method: "GET",
        headers: {
            "Authorization": "Bearer "+token
        }
    });
    
    return res.json();
    
}