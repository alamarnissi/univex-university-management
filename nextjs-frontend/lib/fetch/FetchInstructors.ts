import { getCookie } from "cookies-next";
import { InstructorType } from "../types/dataTypes";


const instructors_url = process.env.NEXT_PUBLIC_AUTH_API_URL;
const token = getCookie("access_token") || "";

export const fetchWSInstrcutors = async (url: string, sortValue = "most-recent", searchValue?: string) => {
    let full_url = url + "?sort_instructor=" + sortValue;

    if (searchValue !== "") {
        full_url += "&instructor_name=" + searchValue;
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

export const fetchAddInstructorToWS = async ({instructor}: {instructor: InstructorType}) => {
    const url = instructors_url+"/v1/instructors/create";

    const res = await fetch(url, {
        mode: "cors",
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-type": "application/json",
            "Charset": "UTF-8"
        }, 
        body: JSON.stringify({
            instructor_name: instructor.username,
            email: instructor.email
        })
    })

    return res.json();
}


export const fetchDeleteInstructor = async ({instructor_id}: {instructor_id: string}) => {
    const url = instructors_url+`/v1/instructors/delete/${instructor_id}`;

    const res = await fetch(url, {
        mode: "cors",
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Charset": "UTF-8"
        }
    })
    return res.json();
}