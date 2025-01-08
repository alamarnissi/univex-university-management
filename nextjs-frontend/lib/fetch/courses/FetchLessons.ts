import { CreateLessonType, ProjectLessonDetailsType } from "@/lib/types/dataTypes";
import { getCookie } from "cookies-next";


const courses_url = process.env.NEXT_PUBLIC_COURSES_API_URL;
const token = getCookie("access_token") || "";


export const fetchGetSingleLesson = async (lesson_id: string, module_id: string) => {
    const url = courses_url + `/v1/courses/module-lessons/${module_id}/get/${lesson_id}`;

    const res = await fetch(url, {
        mode: "cors",
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Charset": "UTF-8",
            "Authorization": "Bearer " + token
        }
    })

    const response = res.json();
    return response;
}

export const fetchCreateCourseLessons = async (lessonData: CreateLessonType) => {
    const url = courses_url + "/v1/courses/module-lessons/create";

    const res = await fetch(url,
        {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ ...lessonData }),
        });

    const response = res.json();
    return response;
}

export const fetchUpdateLesson = async (lesson_id: string, lessonData: Partial<CreateLessonType>) => {
    const url = courses_url + `/v1/courses/module-lessons/update/${lesson_id}`;

    const res = await fetch(url,
        {
            mode: "cors",
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ ...lessonData }),
        });

    const response = res.json();
    return response;
}

export const fetchDeleteModuleLesson = async (moduleId: string, courseId: string, lesson_id: string) => {
    const url = courses_url + `/v1/courses/modules-lessons/delete/${lesson_id}`;

    const res = await fetch(url,
        {
            mode: "cors",
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ courseId, moduleId }),
        });

    const response = res.json();
    return response;
}

export const fetchReorderModuleLessons = async (module_id: string, newLessonOrder: { lesson_id: string; order: number }[]) => {
    const url = courses_url + `/v1/courses/module-lessons/${module_id}/reorder`;

    const res = await fetch(url,
        {
            mode: "cors",
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(newLessonOrder),
        });

    const response = res.json();
    return response;
}

export const fetchCreateProjectLesson = async (courseId: string, moduleId: string, projectData: ProjectLessonDetailsType) => {
    const url = courses_url + "/v1/courses/module-lessons/project/create";

    const res = await fetch(url,
        {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ ...projectData, courseId, moduleId }),
        });

    const response = res.json();
    return response;
}


export const fetchUploadLessonFile = async (file: File, course_slug: string, workspace_id: string) => {
    const url = courses_url + "/v1/courses/module-lessons/upload";

    const formData = new FormData();
    formData.append("file", file as Blob);
    formData.append("course_slug", course_slug);
    formData.append("workspace_id", workspace_id);

    const res = await fetch(url,
        {
            mode: "cors",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });

    const response = res.json();
    return response;
}

export const fetchUploadVideoLessonBunny = async (file: File, lesson_name: string) => {
    const url = courses_url + "/v1/courses/module-lessons/bunny-upload";

    const formData = new FormData();
    formData.append("file", file as Blob);
    formData.append("lesson_name", lesson_name);

    const res = await fetch(url,
        {
            mode: "cors",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });

    const response = res.json();
    return response;
}