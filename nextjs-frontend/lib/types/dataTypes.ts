import { StaticImageData } from "next/image";

export type HelpDataType = {
    id: number;
    image: StaticImageData;
    title: any;
    list: any[];
};

export type PlatformDataType = {
    id: number,
    title: any,
    bgColor: string
}

export type FeaturesDataType = {
    id: number,
    image: StaticImageData,
    imgSize: number,
    title: any,
    text: any
}


////////////////////
//// Courses Types
////////////////////

export type CourseDisplayType = {
    course_id?: string
    workspace_id?: string
    created_at?: string
    course_name: string
    slug: string
    course_status: string
    overall_rating: number
    promotional_image: string
    total_modules_number: string
}

export type AllCoursesResponseType = {
    courses: CourseDisplayType[];
    total: number;
};

export type CourseDataType = {
    course_id?: string,
    course_name: string,
    course_type: "self-paced" | "cohort-based",
    course_description: string,
    course_level?: "Beginner" | "Medium" | "Advanced",
    curriculum_type?: "Manual" | "AI_Generated",
    course_access: "Free" | "Paid",
    course_duration: number,
    price?: number,
    preferred_currency?: "USD" | "EURO" | "TND",
    promotional_video?: string,
    promotional_image?: string
}

export type ScheduleType = {
    start_date: string,
    end_date: string,
    course_capacity: string,
    max_group_size: string
}

////////////////////
//// Instructor Types
////////////////////

export type InstructorType = {
    workspace_id?: string,
    instructor_id?: string,
    username?: string,
    instructor_name?: string,
    email?: string,
    profession?: string,
    role?: string,
    profile_image?: string,
    created_at?: string,
    updated_at?: string,
    last_login?: string,
    workspaces?: any
}


////////////////////
//// Student Types
////////////////////

export type StudentType = {
    workspace_id?: string,
    student_id?: string,
    student_name?: string,
    email?: string,
    profile_image?: string,
    created_at?: string,
    updated_at?: string,
    last_login?: string,
    workspaces?: any
}

////////////////////
//// Tracks Types
////////////////////
export type TrackDisplayType = {
    track_id?: string,
    track_name: string,
    created_at?: string
}

export type TrackCoursesList = {
    course_id: string,
    course_name: string,
    unavailable?: string
}

export type TrackDataType = {
    track_name?: string,
    track_description: string,
    courses: TrackCoursesList[]
}

////////////////////
//// Courses Modules Types
////////////////////

export type ModuleDataType = {
    module_id: string,
    module_name: string,
    order: number,
    lessons: LessonType[]
}

export type ReordredModuleType = {
    module_id: string,
    module_name: string,
    order: number,
}

export type CreateModuleType = {
    module_name: string,
    course_id: string,
    order: number,
}


////////////////////
//// Courses lessons Types
////////////////////
export type LessonType = {
    lesson_id: string,
    lesson_name: string,
    lesson_status: string,
    lesson_type: string,
    order: number
}

export type LessonDetailsType = {
    lesson_id?: string,
    lesson_name: string,
    lesson_status: string,
    moduleId: string,
    order: number,
    file_url?: string,
    content?: string,
    lesson_type: string
}

export type CreateLessonType = {
    courseId: string,
    lesson_name: string,
    lesson_status: string,
    moduleId: string,
    order: number,
    file_url?: string,
    content?: string,
    lesson_type: string
}

export type ReorderLessonType = {
    lesson_id: string,
    order: number
}

export type ProjectLessonDetailsType = {
    lesson_id?: string,
    order: number,
    lesson_status?: string,
    project_name: string,
    description: string,
    keywords: string[],
    skills: string[],
    instructions: string,
    complete_option: any,
    attachements: string[],
    deadline?: Date | null
}


/**
 * File types
 */
export interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}