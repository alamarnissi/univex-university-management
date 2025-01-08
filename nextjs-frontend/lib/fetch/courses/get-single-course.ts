
import 'server-only'

export const getSingleCoursesData = async ({token, slug}: {token: string, slug:string}) => {

    const url = process.env.NEXT_PUBLIC_COURSES_API_URL + `/v1/courses/get/${slug}`;


    const res = await fetch(url, {
        mode: "cors",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })

    return res.json();
    
}