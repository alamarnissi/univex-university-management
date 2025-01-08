import React, { useState } from 'react'
import { useSWRConfig } from 'swr'
import Tiptap from '@/components/TiptapEditor/Tiptap'
import { useToast } from '@/components/ui/toast/use-toast'
import { useSingleCourseStore } from '@/stores/useCourseStore'
import { BsCheck } from 'react-icons/bs'
import { useTiptapEditorStore } from '@/stores/useGlobalStore'
import { fetchCreateCourseLessons, fetchUpdateLesson } from '@/lib/fetch/courses/FetchLessons'
import { useModalStore } from '@/stores/useModalsStore'
import { LessonDetailsType, ModuleDataType } from '@/lib/types/dataTypes'


const initiateFormValue = {
    lesson_name: "",
    lesson_status: "draft",
    moduleId: "",
    order: 1,
    content: "",
    lesson_type: "Text"
}


const TextEditorUnit = () => {
    const { toast } = useToast();
    const { mutate } = useSWRConfig();

    const { editorState, setEditorState } = useTiptapEditorStore()
    const { course_modules, course_id, course_slug, selected_lesson, setSelectedLesson } = useSingleCourseStore();
    const { setModalOpenState, actionTypeState } = useModalStore();

    const [isLoading, setIsLoading] = useState(false);
    const [formValue, setFormValue] = useState<LessonDetailsType>(selected_lesson ? selected_lesson : initiateFormValue)
    const { lesson_name, lesson_status, moduleId, content } = formValue;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const handleEditLesson = async (lessonData: LessonDetailsType) => {
        setIsLoading(true);

        if(lessonData.content === null) {
            setIsLoading(false);
            toast({ variant: "destructive", description: "Please enter lesson content" });
            return;
        }

        const { lesson_id, ...rest } = lessonData;

        try {
            const response = await fetchUpdateLesson(lesson_id as string, {...rest, courseId: course_id});
            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: "Lesson updated successfully" });
                    // setEditorState(null);
                    setSelectedLesson(null);
                    setModalOpenState(false);
                } else {
                    toast({ variant: "destructive", description: "Something went wrong" });
                }
            }
        } catch (error) {
            toast({ variant: "destructive", description: "An Error Has Occurred" });
        }

        mutate(process.env.NEXT_PUBLIC_COURSES_API_URL + `/v1/courses/get/${course_slug}`);
        setIsLoading(false);
    }

    const handleSubmit = async (lessonData: LessonDetailsType) => {
        // e.preventDefault();
        setIsLoading(true);

        const newTextLesson = {
            ...lessonData,
            courseId: course_id,
            order: course_modules.filter((module: ModuleDataType) => module.module_id === formValue.moduleId)[0].lessons.length + 1,
        }

        if(lessonData.content === null) {
            setIsLoading(false);
            toast({ variant: "destructive", description: "Please enter lesson content" });
            return;
        }

        try {
            const response = await fetchCreateCourseLessons(newTextLesson);
            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: "Lesson created successfully" });
                    // setEditorState(null);
                    setModalOpenState(false);
                } else {
                    toast({ variant: "destructive", description: "Something went wrong" });
                }
            }
        } catch (error) {
            toast({ variant: "destructive", description: "An Error Has Occurred" });
        }
        mutate(process.env.NEXT_PUBLIC_COURSES_API_URL + `/v1/courses/get/${course_slug}`);
        setIsLoading(false);
    }

    return (
        <div
            className='pt-8 pb-6 px-3 flex flex-col justify-center gap-4 bg-white shadow-md rounded-md'
            
        >
            <div className='self-stretch pr-0 md:pr-5 leading'>
                <label htmlFor="status" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                    Status
                </label>
                <div className='flex'>
                    <div className="flex items-center mr-5 relative cursor-pointer">
                        <input
                            checked={lesson_status === "draft"}
                            onChange={handleChange}
                            id="draft"
                            type="radio"
                            value="draft"
                            name="lesson_status"
                            className="w-5 h-5 appearance-none rounded-sm text-primary bg-gray-100 border-gray-300 dark:bg-white dark:border-gray-600 checked:bg-primary dark:checked:bg-primary"
                        />
                        <label htmlFor="draft" className="flex items-center justify-between gap-4 -ml-5 text-sm font-medium text-gray-900 dark:text-gray-300">
                            <BsCheck size={20} className='text-gray-100' />
                            <span>Draft</span>
                        </label>
                    </div>
                    <div className="flex items-center relative cursor-pointer">
                        <input
                            checked={lesson_status === "published"}
                            onChange={handleChange}
                            id="published"
                            type="radio"
                            value="published"
                            name="lesson_status"
                            className="w-5 h-5 appearance-none rounded-sm text-primary bg-gray-100 border-gray-300 dark:bg-white dark:border-gray-600 checked:bg-primary dark:checked:bg-primary"
                        />
                        <label htmlFor="published" className="flex items-center justify-between gap-4 -ml-5 text-sm font-medium text-gray-900 dark:text-gray-300">
                            <BsCheck size={20} className='text-gray-100' />
                            <span>Published</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className='self-stretch pr-0 md:pr-5 leading'>
                <label htmlFor="lesson_name" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                    Title
                </label>
                <input onChange={handleChange} type="text" value={lesson_name} name="lesson_name" id="lesson_name" required 
                className="bg-[#F8F9FC] border border-gray-300 text-gray-900 text-sm rounded-lg md:min-w-[400px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" />
            </div>
            {actionTypeState === "addUnit" ?
                <div className='self-stretch pr-0 md:pr-5 leading'>
                    <label htmlFor="under_module" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                        Under Module
                    </label>
                    <select
                        name='moduleId'
                        id="under_module"
                        value={moduleId}
                        onChange={handleSelectChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                        <option value="">Choose module</option>
                        {course_modules.map((module: ModuleDataType) => (
                            <option key={module.module_id} value={module.module_id}>{module.module_name}</option>
                        ))}
                    </select>
                </div>
                :
                null
            }
            <div className='self-stretch pr-0 md:pr-5 leading'>
                <label className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                    Enter Lesson Content
                </label>
                <Tiptap 
                    key={"newTextUnit"}
                    handleEditorState={(value: string) => setFormValue((prevState) => { return { ...prevState, content: value } })}
                    editorState={content}
                />
            </div>

            <div className='mt-4'>
                <div className='flex items-center justify-start gap-3 md:justify-end mt-7 md:mt-0'>
                    <button
                        type="button"
                        className="text-primary inline-flex items-center hover:bg-primary/90 hover:text-white border-2 border-primary font-semibold rounded-lg text-base px-5 py-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        onClick={() => { setModalOpenState(false) }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        onClick={() => actionTypeState === "editUnit" && selected_lesson ? handleEditLesson(formValue) : handleSubmit(formValue)}
                        className="disabled:cursor-not-allowed disabled:opacity-90 text-white inline-flex justify-center gap-2 items-center bg-[#D9186C] hover:bg-[#D9186C]/90 focus:outline-none font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-[#D9186C] dark:hover:bg-[#D9186C]/90"
                    >
                        Save {isLoading && <span className='loading-spinner animate-spinner'></span>}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TextEditorUnit