import 'server-only'

export const getCoursesData = async ({token}: {token: string}) => {

    const url = process.env.COURSES_API_URL + "/v1/courses/list";
    let allcourses_url = url + "?sort_course=most-recent";

    const data = await fetch(allcourses_url, {
        mode: "cors",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })

    return data.json()
    
}