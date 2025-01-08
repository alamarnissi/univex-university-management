import 'server-only'

export const getStudentsData = async ({token}: {token: string}) => {
    const url = process.env.NEXT_PUBLIC_AUTH_API_URL + "/v1/students/list";

    const res = await fetch(url+ "?sort_students=most-recent", {
        mode: "cors",
        method: "GET",
        headers: {
            "Authorization": "Bearer "+token
        }
    });
    
    return res.json();
    
}