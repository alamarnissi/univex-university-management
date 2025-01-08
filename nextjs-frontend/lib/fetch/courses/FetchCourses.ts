import { getCookie } from "cookies-next";
import { CourseDataType, InstructorType, ScheduleType, StudentType } from "../../types/dataTypes";


const courses_url = process.env.NEXT_PUBLIC_COURSES_API_URL;
const token = getCookie("access_token") || "";


export const fetchCourses = async (url: string, sortValue = "most-recent", statusValue?: string, searchValue?: string) => {
    let full_url = url + "?sort_course=" + sortValue;

    if (statusValue !== "") {
        full_url += "&status=" + statusValue;
    }

    if (searchValue !== "") {
        full_url += "&course_name=" + searchValue;
    }

    const res = await fetch(full_url, {
        mode: "cors",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    }).then(r => r.json())

    return res;
}

export const fetchSingleCourse = async (url: string) => {
    const res = await fetch(url, {
        mode: "cors",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    }).then(r => r.json())

    return res;
}

export const fetchCreateCourse = async (course: CourseDataType) => {
    const url = courses_url + "/v1/courses/create";


    const res = await fetch(url,
        {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Charset": "UTF-8",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ ...course, course_duration: Number(course.course_duration), price: Number(course.price) }),
        });

    const response = res.json();
    return response;
}

export const fetchAssignInstructor = async ({ instructor, course_slug }: { instructor: InstructorType, course_slug: string }) => {
    const url = courses_url + `/v1/courses/assign-instructor/${course_slug}`;

    const res = await fetch(url, {
        mode: "cors",
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            "Charset": "UTF-8",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(instructor),
    })

    return res.json();
}

export const fetchRemoveInstructorFromCourse = async ({ instructor, course_slug }: { instructor: InstructorType, course_slug: string }) => {
    const url = courses_url + `/v1/courses/delete-instructor/${course_slug}`;

    const res = await fetch(url, {
        mode: "cors",
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            "Charset": "UTF-8",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(instructor),
    })

    return res.json();
}

export const fetchAssignStudent = async ({ student, course_slug }: { student: StudentType, course_slug: string }) => {
    const url = courses_url + `/v1/courses/assign-student/${course_slug}`;

    const res = await fetch(url, {
        mode: "cors",
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            "Charset": "UTF-8",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(student),
    })

    return res.json();
}

export const fetchRemoveStudentFromCourse = async ({ student, course_slug }: { student: StudentType, course_slug: string }) => {
    const url = courses_url + `/v1/courses/delete-student/${course_slug}`;

    const res = await fetch(url, {
        mode: "cors",
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            "Charset": "UTF-8",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(student),
    })

    return res.json();
}

export const fetchAddScheduleCourse = async ({ schedule, course_slug }: { schedule: ScheduleType, course_slug: string }) => {
    const url = courses_url + `/v1/courses/add_course_schedule/${course_slug}`;

    const res = await fetch(url, {
        mode: "cors",
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Charset": "UTF-8",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            start_date: schedule.start_date,
            end_date: schedule.end_date,
            course_capacity: Number(schedule.course_capacity),
            max_group_size: Number(schedule.max_group_size)
        }),
    })

    return res.json();
}

export const fetchUpdateCourse = async ({ course_id, course }: { course_id: string, course: CourseDataType }) => {
    const url = courses_url + `/v1/courses/update/${course_id}`;

    const { price, course_access, ...rest } = course;


    const res = await fetch(url, {
        mode: "cors",
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            "Charset": "UTF-8",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            ...course,
            price: course_access === "Free" ? 0 : Number(course.price),
            course_duration: Number(course.course_duration)
        }),
    })

    return res.json();
}

export const fetchPartialUpdateCourse = async ({ course_id, course }: { course_id: string, course: Partial<CourseDataType> }) => {
    const url = courses_url + `/v1/courses/partial-update/${course_id}`;

    const res = await fetch(url, {
        mode: "cors",
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            "Charset": "UTF-8",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ ...course }),
    })

    return res.json();
}

export const fetchDeleteCourse = async ({ course_slug }: { course_slug: string }) => {
    const url = courses_url + `/v1/courses/delete/${course_slug}`;

    const res = await fetch(url, {
        mode: "cors",
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            "Charset": "UTF-8",
            "Authorization": "Bearer " + token
        }
    })

    return res.json();
}

export const fetchUploadCourseImage = async (file: File, course_slug: string, filetype: string) => {
    const url = courses_url + `/v1/courses/upload`;

    const formData = new FormData();
    formData.append("file", file as Blob);
    formData.append("course_slug", course_slug);
    formData.append("filetype", filetype);

    const res = await fetch(url, {
        mode: "cors",
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
    })

    return res.json();
}

export const fetchChangeCourseStatus = async (course_slug: string, course_status: string) => {
    const url = courses_url + `/v1/courses/change-status/${course_slug}`;

    const res = await fetch(url, {
        mode: "cors",
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            "Charset": "UTF-8",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ course_status }),
    })

    return res.json();
}