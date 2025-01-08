import { InstructorType } from "@/lib/types/dataTypes"
import {create} from "zustand"

interface InstructorsProps {
    all_instructors: InstructorType[],
    setAllInstructors: (instructorsList: InstructorType[] | []) => void
}

interface WorkspacesProps {
    workspace_subdomain: string,
    setWorkspaceSubdomain: (subdomain: string) => void
}

export const useInstructorsStore = create<InstructorsProps>()((set) => ({
    all_instructors: [],
    setAllInstructors: (data) => set((state) => ({all_instructors: data})),
}))

export const useWSGlobalStore = create<WorkspacesProps>()((set) => ({
    workspace_subdomain: "",
    setWorkspaceSubdomain: (data) => set((state) => ({workspace_subdomain: data})),
}))