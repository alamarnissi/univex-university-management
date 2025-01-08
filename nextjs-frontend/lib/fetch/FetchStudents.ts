import { getCookie } from "cookies-next";

const students_url = process.env.NEXT_PUBLIC_AUTH_API_URL;
const token = getCookie("access_token") || "";

export const fetchWSStudents = async (url: string, sortValue = "most-recent", searchValue?: string) => {
    let full_url = url + "?sort_student=" + sortValue;

    if (searchValue !== "") {
        full_url += "&student_name=" + searchValue;
    }
    const res = await fetch(full_url, {
        mode: "cors",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    
    return res.json();
}