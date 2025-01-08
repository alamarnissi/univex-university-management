
"use server"
const workspaces_url = process.env.NEXT_PUBLIC_AUTH_API_URL;

export const fetchWSname = async (subdomain: string) => {
    let full_url = workspaces_url + `/v1/workspaces/${subdomain}`;

    const res = await fetch(full_url, {
        mode: "cors",
        method: "GET",
    });
    
    return res.json();
}

export const fetchWSKpis = async (subdomain: string, token: string) => {
    let full_url = process.env.COURSES_API_URL + `/v1/workspaces/${subdomain}/metrics`;

    const res = await fetch(full_url, {
        mode: "cors",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    
    return res.json();
}