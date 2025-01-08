
import { CourseDataType, CreateLessonType, InstructorType, LessonDetailsType, ModuleDataType, ScheduleType } from "@/lib/types/dataTypes"
import {create} from "zustand"

interface CourseStepsProps {
    modalOpenState: boolean
    currentStep: number
    nextStep: number
    previousStep: number
    setModalOpenState: (value: boolean) => void
    setCurrentStep: (value: number) => void
    setNextStep: () => void
    setPreviousStep: () => void
}

const initialCourseData : CourseDataType = {
    course_name: "",
    course_type: "self-paced",
    course_description: "",
    course_level: "Beginner",
    course_access: "Free",
    course_duration: 0,
    price: 0,
    preferred_currency: "TND",
    promotional_video: "",
    promotional_image: ""
}

interface CourseDataProps {
    course : CourseDataType,
    updateCourseState : (data: CourseDataType) => void,
    initializeCourseState: () => void
}

interface SingleCourseProps {
    workspace_id: string,
    workspace_subdomain: string,
    course_id: string,
    course_slug: string,
    curriculum_type: "Manual" | "AI_Generated" | null,
    schedules: ScheduleType[],
    assigned_instructors: InstructorType[],
    course_modules: ModuleDataType[],
    selected_lesson: LessonDetailsType | null,
    selected_module_id: string,
    setWorkspaceID: (value: string) => void
    setWorkspaceSubdomain: (value: string) => void
    setCourseID: (value: string) => void
    setCourseSlug: (value: string) => void
    setCurriculumType: (value: "Manual" | "AI_Generated" | null) => void
    setAssignedInstructors: (instructorsList: InstructorType[] | []) => void
    setCourseModules: (modulesList: ModuleDataType[] | []) => void
    setSelectedLesson: (lesson: LessonDetailsType | null) => void
    setSelectedModuleId: (value: string) => void
    setSchedules: (schedulesList: ScheduleType[] | []) => void
}

interface CoursesControleProps {
    isActiveValue: string,
    statusValue: string,
    sortValue: string,
    searchValue: string,
    setIsActiveValue: (value: string) => void
    setStatusValue: (value: string) => void
    setSortValue: (value: string) => void
    setSearchValue: (value: string) => void
}

interface MultiChoiceActivityProps {
    nbrQuestionsState: number,
    difficultyState: string,
    setNbrQuestions: (value: number) => void
    setDifficulty: (value: string) => void
}

export const useCourseStepsStore = create<CourseStepsProps>()((set) => ({
    modalOpenState: false,
    currentStep: 1, // is "1" -> "3" means steps for 1 to 3, if "4" means it's processing
    nextStep: 1,
    previousStep: 1,
    setModalOpenState: (value) => set(() => ({modalOpenState: value})),
    setCurrentStep: (value) => set(() => ({currentStep: value})),
    setNextStep: () => set((state) => ({currentStep: state.currentStep + 1})),
    setPreviousStep: () => set((state) => ({currentStep: state.currentStep - 1})),
}))

export const useSingleCourseStore = create<SingleCourseProps>()((set) => ({
    workspace_id: "",
    workspace_subdomain: "",
    course_id: "",
    course_slug: "",
    curriculum_type: null,
    schedules: [],
    assigned_instructors: [],
    course_modules: [],
    selected_lesson: null,
    selected_module_id: "",
    setWorkspaceID: (data) => set((state) => ({workspace_id: data})),
    setWorkspaceSubdomain: (data) => set((state) => ({workspace_subdomain: data})),
    setCourseID: (data) => set((state) => ({course_id: data})),
    setCourseSlug: (data) => set((state) => ({course_slug: data})),
    setCurriculumType: (data) => set((state) => ({curriculum_type: data})),
    setAssignedInstructors: (data) => set((state) => ({assigned_instructors: data})),
    setCourseModules: (data) => set((state) => ({course_modules: data})),
    setSelectedLesson: (data) => set((state) => ({selected_lesson: data})),
    setSelectedModuleId: (data) => set((state) => ({selected_module_id: data})),
    setSchedules: (data) => set((state) => ({schedules: data})),
}))

export const useCourseCreationStore = create<CourseDataProps>()((set) => ({
    course: initialCourseData,
    updateCourseState: (data) => set((state) => ({course: data})),
    initializeCourseState: () => set(() => ({course: initialCourseData}))
}))

export const useCoursesControlsStore = create<CoursesControleProps>((set) => ({
    isActiveValue: "all",
    statusValue: "",
    sortValue: "most-recent",
    searchValue: "",
    setStatusValue: (value) => set((state) => ({statusValue: value})),
    setIsActiveValue: (value) => set((state) => ({isActiveValue: value})),
    setSortValue: (value) => set((state) => ({sortValue: value})),
    setSearchValue: (value) => set((state) => ({searchValue: value})),
}))

export const useMultiChoiceActivityStore = create<MultiChoiceActivityProps>((set) => ({
    nbrQuestionsState: 0,
    difficultyState: "easy",
    setNbrQuestions: (value) => set((state) => ({nbrQuestionsState: value})),
    setDifficulty: (value) => set((state) => ({difficultyState: value})),
}))