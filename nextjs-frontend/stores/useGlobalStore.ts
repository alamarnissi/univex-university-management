import { DashboardMenuType } from "@/lib/types/menu";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LangLocale {
    localeState: string;
    setLocaleState: (localeCookie: string) => void
}

interface CollapsedProps {
    isCollapsedState: boolean
    setIsCollapsedState: (value: boolean) => void 
}

interface DashboardSidebarProps {
    activeSidebarRoutesState: DashboardMenuType[] | []
    isStudentSingleCourse: boolean
    setActiveSidebarRoutesState: (value: DashboardMenuType[] | []) => void
    setIsStudentSingleCourse: (value: boolean) => void
}

type CurrentUserType = {
    role: string,
    user_id?: string,
    workspace_id?: string,
    username: string,
    email?: string
}

interface AuthUserProps {
    currentUser: {
        role: string,
        user_id?: string,
        workspace_id?: string,
        username: string,
        email?: string
    }
    updateAuthUserState: (data: CurrentUserType) => void,
    initiateAuthUserState: () => void
}

interface ControleProps {
    sortValue: string,
    searchValue: string,
    setSortValue: (value: string) => void
    setSearchValue: (value: string) => void
}

interface FilesUploadProps {
    multiFilesState: File[] | null,
    fileState: File | Blob | MediaSource | null,
    previewFileState: string | null,
    setMultiFilesState: (files: File[] ) => void,
    setFileState: (file: File | Blob | MediaSource | null) => void
    setPreviewFileState: (fileUrl: string | null) => void
}

interface TiptapEditorProps {
    editorState: any,
    setEditorState: (value: any) => void
}

const currentUserInitialState = {
    role: "",
    user_id: "",
    workspace_id: "",
    username: "",
    email: ""
}

export const useLangLocale = create<LangLocale>()(
    persist(
        (set) => ({
            localeState: "en",
            setLocaleState: (locale) => set(() => ({ localeState: locale }))
        }),
        {
            name: "locale"
        }
    )
)

export const useDashboardSidebarStore = create<DashboardSidebarProps>()((set) => ({
    activeSidebarRoutesState: [],
    isStudentSingleCourse: false,
    setActiveSidebarRoutesState: (value) => set(() => ({activeSidebarRoutesState: value})),
    setIsStudentSingleCourse: (value) => set(() => ({isStudentSingleCourse: value})),
}))

// used for tracking the state of the sidebar 
export const useCollapsedSidebar = create<CollapsedProps>()(
    persist(
        (set) => ({
            isCollapsedState: false,
            setIsCollapsedState: (value) => set(() => ({ isCollapsedState: value })),
        }),
        {
            name: "sidebarCollapsed"
        }
    )
)

export const useControlsStore = create<ControleProps>((set) => ({
    sortValue: "most-recent",
    searchValue: "",
    setSortValue: (value) => set((state) => ({sortValue: value})),
    setSearchValue: (value) => set((state) => ({searchValue: value})),
}))

// used for storing the uploaded files globally
export const useFilesUploadStore = create<FilesUploadProps>((set) => ({
    multiFilesState: null,
    fileState: null,
    previewFileState: null,
    setMultiFilesState: (multiFilesState) => set(() => ({multiFilesState})),
    setFileState: (fileState) => set(() => ({fileState})),
    setPreviewFileState: (previewFileState) => set(() => ({previewFileState})),
}))

export const useTiptapEditorStore = create<TiptapEditorProps>((set) => ({
    editorState: null,
    setEditorState: (editorState) => set(() => ({editorState})),
}))

export const useCurrentUserState = create<AuthUserProps>()(
    persist(
        (set) => ({
            currentUser: currentUserInitialState,
            updateAuthUserState: (data) => set((state) => ({currentUser: data})),
            initiateAuthUserState: () => {
                set((state) => ({currentUser: currentUserInitialState}));
            }
        }),
        {
            name: "aca_current_user"
        }
    )
)