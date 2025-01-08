import { LessonType } from "@prisma/client"

export class CreateLessonDto {
    courseId: string
    moduleId: string
    lesson_name: string
    lesson_status?: string
    lesson_type: LessonType
    order: number
    file_url?: string
    content?: string
    isFree?: boolean
    xpPoints?: number
}


export class createProjectlessonDto {
    courseId: string
    moduleId: string
    // For Lesson model creation
    order: number
    isFree?: boolean
    xpPoints?: number
    // For Project model creation
    project_name: string
    description: string
    keywords: string[]
    skills: string[]
    instructions: string
    complete_option: string
    attachements: string[]
    deadline?: Date
}