import { CreateModuleType } from "@/lib/types/dataTypes";
import { getCookie } from "cookies-next";


const courses_url = process.env.NEXT_PUBLIC_COURSES_API_URL;
const token = getCookie("access_token") || "";

export const fetchCreateCourseModules = async (moduleData: CreateModuleType) => {
    const url = courses_url + "/v1/courses/modules/create";

    const res = await fetch(url,
        {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ ...moduleData }),
        });

    const response = res.json();
    return response;
}


export const fetchUpdateCourseModules = async (module_id: string, module_name: string) => {
    const url = courses_url + `/v1/courses/modules/update/${module_id}`;

    const res = await fetch(url,
        {
            mode: "cors",
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ module_name }),
        });

    const response = res.json();
    return response;
}

export const fetchDeleteCourseModules = async (module_id: string, course_id: string) => {
    const url = courses_url + `/v1/courses/modules/delete/${module_id}`;

    const res = await fetch(url,
        {
            mode: "cors",
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ course_id }),
        });

    const response = res.json();
    return response;
}

export const fetchReorderCourseModules = async (course_id: string, newModuleOrder: { module_id: string; module_name: string; order: number }[]) => {
    const url = courses_url + `/v1/courses/${course_id}/modules/reorder`;

    const res = await fetch(url,
        {
            mode: "cors",
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(newModuleOrder),
        });

    const response = res.json();
    return response;
}