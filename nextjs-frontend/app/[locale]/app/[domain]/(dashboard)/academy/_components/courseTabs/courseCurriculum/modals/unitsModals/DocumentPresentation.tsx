import FilesInputField from '@/components/Common/FilesInputField'
import { useToast } from '@/components/ui/toast/use-toast';
import { fetchCreateCourseLessons, fetchUpdateLesson, fetchUploadLessonFile } from '@/lib/fetch/courses/FetchLessons';
import { LessonDetailsType, ModuleDataType } from '@/lib/types/dataTypes';
import { useSingleCourseStore } from '@/stores/useCourseStore';
import { useFilesUploadStore } from '@/stores/useGlobalStore';
import { useModalStore } from '@/stores/useModalsStore';
import React, { useState } from 'react'
import { BsCheck } from 'react-icons/bs'
import { useSWRConfig } from 'swr';

const initiateFormValue = {
    lesson_name: "",
    lesson_status: "draft",
    moduleId: "",
    order: 1,
    file_url: "",
    lesson_type: "Doc_Presentation"
}

const DocumentPresentation = () => {
    const { toast } = useToast();
    const { mutate } = useSWRConfig();

    const { previewFileState, fileState, setFileState, setPreviewFileState } = useFilesUploadStore()
    const { course_modules, course_id, course_slug, workspace_subdomain, selected_lesson, setSelectedLesson } = useSingleCourseStore()
    const { setModalOpenState, actionTypeState } = useModalStore()

    const [isLoading, setIsLoading] = useState(false);
    const [formValue, setFormValue] = useState<LessonDetailsType>(selected_lesson ? selected_lesson : initiateFormValue)
    const { lesson_name, lesson_status, moduleId } = formValue;

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

        let uploadedFilePath = previewFileState as string | "";
        // upload image 
        if (fileState) {
            const uploadRes = await fetchUploadLessonFile(fileState as File, course_slug, workspace_subdomain);

            if (uploadRes.status !== 200) {
                setIsLoading(false);
                toast({ variant: "destructive", description: "Failed to upload" });
                return;
            }

            setPreviewFileState(uploadRes?.data?.fileName);
            uploadedFilePath = uploadRes?.data?.fileName;
        }

        const { lesson_id, ...rest } = lessonData;

        try {
            const response = await fetchUpdateLesson(lesson_id as string, { ...rest, file_url: uploadedFilePath as string, courseId: course_id });
            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: "Lesson updated successfully" });
                    setFileState(null);
                    setPreviewFileState(null);
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
        setIsLoading(true);
        // upload image 
        if (!fileState) {
            setIsLoading(false);
            toast({ variant: "destructive", description: "Please select a file to upload" });
            return;
        }

        const uploadRes = await fetchUploadLessonFile(fileState as File, course_slug, workspace_subdomain);

        if (uploadRes.status !== 200) {
            setIsLoading(false);
            toast({ variant: "destructive", description: "Failed to upload" });
            return;
        }

        const newVideoLesson = {
            ...lessonData,
            courseId: course_id,
            order: course_modules.filter((module: ModuleDataType) => module.module_id === formValue.moduleId)[0].lessons.length + 1,
            file_url: uploadRes.data.fileName
        }

        try {
            const response = await fetchCreateCourseLessons(newVideoLesson);
            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: "Lesson created successfully" });
                    setFileState(null);
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
        <form
            className='pt-8 pb-6 px-3 flex flex-col justify-center gap-4 bg-white shadow-md rounded-md'
            onSubmit={(e) => {
                e.preventDefault();
                actionTypeState === "editUnit" && selected_lesson ? handleEditLesson(formValue) : handleSubmit(formValue)
            }}
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
                <input onChange={handleChange} type="text" value={lesson_name} name="lesson_name" id="lesson_name" className="bg-[#F8F9FC] border border-gray-300 text-gray-900 text-sm rounded-lg md:min-w-[400px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
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
                <label htmlFor="document" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                    {actionTypeState === "editUnit" ? "Update your" : "Upload"} document or presentation
                </label>
                <FilesInputField
                    maxFiles={1}
                    acceptTypes="application/pdf, application/msword, .doc, .docx, .csv"
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
                        className="disabled:cursor-not-allowed disabled:opacity-90 text-white inline-flex justify-center gap-2 items-center bg-[#D9186C] hover:bg-[#D9186C]/90 focus:outline-none font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-[#D9186C] dark:hover:bg-[#D9186C]/90"
                    >
                        Save {isLoading && <span className='loading-spinner animate-spinner'></span>}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default DocumentPresentation