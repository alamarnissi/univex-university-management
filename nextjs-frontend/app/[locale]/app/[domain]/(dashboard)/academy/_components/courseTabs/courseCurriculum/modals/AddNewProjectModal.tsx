"use client"
import { Dialog, Listbox, Transition } from '@headlessui/react'
import Image from 'next/image'
import { Fragment, useState } from 'react'

import FeaturesInputField from '@/components/Common/FeaturesInputField'
import FilesInputField from '@/components/Common/FilesInputField'
import TagsInputField from '@/components/Common/TagsInputField'
import CounterIcon from '@/components/Common/assets/CounterIcon'
import DescFileIcon from '@/components/Common/assets/DescFileIcon'
import DocNameIcon from '@/components/Common/assets/DocNameIcon'
import FilesIcon from '@/components/Common/assets/FilesIcon'
import KeyIcon from '@/components/Common/assets/KeyIcon'
import ListIcon from '@/components/Common/assets/ListIcon'
import RocketIcon from '@/components/Common/assets/RocketIcon'
import TaskCompleteIcon from '@/components/Common/assets/TaskCompleteIcon'
import Tiptap from '@/components/TiptapEditor/Tiptap'
import { X } from 'lucide-react'
import ArrowIcon from "../icons/ArrowIcon.png"
import { useModalStore } from '@/stores/useModalsStore'
import { ModuleDataType, ProjectLessonDetailsType } from '@/lib/types/dataTypes'
import { useSingleCourseStore } from '@/stores/useCourseStore'
import { useToast } from '@/components/ui/toast/use-toast'
import { useSWRConfig } from 'swr'
import { fetchCreateProjectLesson } from '@/lib/fetch/courses/FetchLessons'


const complete_options = [
    { id: 1, name: 'When Instructor accept the answer', value: 'on_accept_answer', unavailable: false },
    { id: 2, name: 'When student submit on time', value: 'on_submit', unavailable: false },
]

const initiateFormValue = {
    order: 1,
    project_name: "",
    description: "",
    keywords: [],
    skills: [],
    instructions: "",
    complete_option: complete_options[1],
    attachements: [],
}

const AddNewProjectModal = () => {
    const { toast } = useToast();
    const { mutate } = useSWRConfig(); 

    const { modalOpenState, setModalOpenState } = useModalStore();
    const { course_modules, course_id, course_slug, selected_module_id } = useSingleCourseStore();

    const [isLoading, setIsLoading] = useState(false);
    const [formValue, setFormValue] = useState<ProjectLessonDetailsType>(initiateFormValue);

    const { project_name, description, keywords, skills, instructions, complete_option, attachements } = formValue;

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

    const handleSubmit = async (projectData: ProjectLessonDetailsType) => {
        
        setIsLoading(true);
        const newProjectLesson = {
            ...projectData,
            complete_option: projectData.complete_option.value,
            order: course_modules.filter((module: ModuleDataType) => module.module_id === selected_module_id)[0].lessons.length + 1,
        }

        try {
            const response = await fetchCreateProjectLesson(course_id, selected_module_id, newProjectLesson);
            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: "Project created successfully" });
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
        <Transition show={modalOpenState} as={Fragment} >
            <Dialog as='div' onClose={() => { setModalOpenState(false) }}>
                {/* Modal backdrop */}
                <Transition.Child
                    className="fixed inset-0 z-[99] bg-black opacity-50 transition-opacity"
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition ease-out duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    aria-hidden="true"
                />
                {/* End: Modal backdrop */}
                {/* Modal dialog */}
                <Transition.Child
                    className="fixed inset-0 z-[999] flex p-0 md:p-6"
                    enter="transition ease-out duration-300"
                    enterFrom="opacity-0 scale-75"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-out duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-75"
                >
                    <div className="max-w-5xl mx-auto h-full flex items-center w-full md:w-auto px-5 md:px-0">
                        <Dialog.Panel className={`relative h-[600px] w-full md:w-[650px] overflow-y-scroll no-scrollbar rounded-3xl shadow-2xl aspect-auto bg-[#F4F7FE] overflow-hidden px-10 pt-5 pb-8`}>
                            <Dialog.Title
                                as="h3"
                                className={"flex items-center justify-center gap-3 font-semibold text-xl text-center pb-5 dark:text-black"}
                            >
                                <Image
                                    src={ArrowIcon}
                                    alt="arrow"
                                    width={24}
                                    height={24}
                                />
                                Add a project
                            </Dialog.Title>
                            <div className='text-center cursor-pointer p-1 absolute top-4 right-5 rounded-md bg-[#D9DADD] hover:bg-[#D9DADD]/80'>
                                <X
                                    size={16}
                                    className='text-black'
                                    onClick={() => { setModalOpenState(false) }}
                                />
                            </div>

                            <div
                                className='pt-8 pb-6 px-3 flex flex-col justify-center gap-4 bg-white shadow-md rounded-md'
                            >
                                <div className='self-stretch pr-0 md:pr-5 leading'>
                                    <label htmlFor="project_name" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                                        <span className="flex items-center p-3 bg-[#EFEEFC] rounded-lg">
                                            <DocNameIcon />
                                        </span>
                                        Project name
                                    </label>
                                    <input
                                        type="text"
                                        name="project_name"
                                        id="project_name"
                                        value={project_name}
                                        onChange={handleChange}
                                        className="bg-[#F8F9FC] border border-gray-300 text-gray-900 text-sm rounded-lg md:min-w-[400px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder=""
                                        required
                                    />
                                </div>
                                <div className='self-stretch pr-0 md:pr-5 leading'>
                                    <label htmlFor="desc" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                                        <span className="flex items-center p-3 bg-[#EFEEFC] rounded-lg">
                                            <DescFileIcon />
                                        </span>
                                        Description
                                    </label>
                                    <Tiptap
                                        reference={"desc"}
                                        handleEditorState={(value: string) => setFormValue((prevState) => { return { ...prevState, description: value } })}
                                        editorState={description}
                                    />
                                </div>
                                <div className='self-stretch pr-0 md:pr-5 leading'>
                                    <label htmlFor="keywords" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                                        <span className="flex items-center p-3 bg-[#EFEEFC] rounded-lg">
                                            <KeyIcon />
                                        </span>
                                        Keywords
                                    </label>
                                    <TagsInputField
                                        handleChange={(value: string[]) => setFormValue((prevState) => { return { ...prevState, keywords: value.filter(e => e) } })}
                                        tagList={keywords}
                                    />
                                </div>
                                <div className='self-stretch pr-0 md:pr-5 leading'>
                                    <label htmlFor="skills" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                                        <span className="flex items-center p-3 bg-[#EFEEFC] rounded-lg">
                                            <RocketIcon />
                                        </span>
                                        Assessed skills
                                    </label>
                                    <FeaturesInputField
                                        handleChange={(value: string[]) => setFormValue((prevState) => { return { ...prevState, skills: value.filter(e => e) } })}
                                    />
                                </div>
                                <div className='self-stretch pr-0 md:pr-5 leading'>
                                    <label htmlFor="instruction" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                                        <span className="flex items-center p-3 bg-[#EFEEFC] rounded-lg">
                                            <ListIcon />
                                        </span>
                                        Instructions
                                    </label>
                                    <Tiptap
                                        reference={"instruction"}
                                        handleEditorState={(value: string) => setFormValue((prevState) => { return { ...prevState, instructions: value } })}
                                        editorState={instructions}
                                    />
                                </div>
                                <div className='self-stretch pr-0 md:pr-5 leading'>
                                    <label htmlFor="relatedRes" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                                        <span className="flex items-center p-3 bg-[#EFEEFC] rounded-lg">
                                            <FilesIcon />
                                        </span>
                                        Related ressources
                                    </label>
                                    <FilesInputField />
                                </div>
                                <div className='self-stretch pr-0 md:pr-5 leading'>
                                    <label htmlFor="relatedRes" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                                        <span className="flex items-center p-3 bg-[#EFEEFC] rounded-lg">
                                            <CounterIcon />
                                        </span>
                                        Deadline to submit
                                    </label>
                                    <div>
                                        <input
                                            type='date'
                                            name='deadline'
                                            id='deadline'
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 text-[15px] font-medium border border-gray-600 rounded-lg bg-[#F8F9FC] text-black'
                                        />
                                    </div>
                                </div>
                                <div className='self-stretch pr-0 md:pr-5 leading'>
                                    <label htmlFor="relatedRes" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                                        <span className="flex items-center p-3 bg-[#EFEEFC] rounded-lg">
                                            <TaskCompleteIcon />
                                        </span>
                                        <div className='flex flex-col'>
                                            <span>
                                                Complete options
                                            </span>
                                            <span className='text-gray-400'>
                                                specify the condition when this unit is considered as complete
                                            </span>

                                        </div>
                                    </label>
                                    <div className='relative'>
                                        <Listbox
                                            value={complete_option}
                                            onChange={(completeOption) => {
                                                setFormValue((prev) => { return { ...prev, complete_option: completeOption } })
                                            }}
                                        >
                                            <Listbox.Button
                                                as={Fragment}
                                            >
                                                <input
                                                    type="text"
                                                    readOnly
                                                    required
                                                    name="complete_option"
                                                    className="flex-shrink flex-grow flex-auto cursor-pointer text-start text-[15px] font-medium text-gray-800 placeholder:text-gray-600 rounded-lg bg-[#F8F9FC] leading-normal w-full border-0 h-10 border-grey-light px-4 py-2 self-center relative outline-none dark:text-gray-600"
                                                    value={complete_option.name}
                                                    onChange={handleChange}
                                                />

                                            </Listbox.Button>
                                            <Transition
                                                enter="transition duration-100 ease-out"
                                                enterFrom="transform scale-95 opacity-0"
                                                enterTo="transform scale-100 opacity-100"
                                                leave="transition duration-75 ease-out"
                                                leaveFrom="transform scale-100 opacity-100"
                                                leaveTo="transform scale-95 opacity-0"
                                                className="absolute top-full z-10 w-full bg-white px-7 py-5 shadow-lg rounded-lg mt-1"
                                            >
                                                <Listbox.Options>
                                                    {complete_options.map((option) => (
                                                        <Listbox.Option
                                                            key={option.id}
                                                            value={option}
                                                            disabled={option.unavailable}
                                                            className="cursor-pointer hover:text-[#D9186C] [&:not(:last-child)]:mb-1.5"
                                                        >
                                                            {option.name}
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                            </Transition>
                                        </Listbox>
                                    </div>
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
                                            onClick={() => {
                                                handleSubmit(formValue);
                                            }}
                                            className="disabled:cursor-not-allowed disabled:opacity-90 inline-flex justify-center gap-2 items-center text-white bg-[#D9186C] hover:bg-[#D9186C]/90 focus:outline-none font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-[#D9186C] dark:hover:bg-[#D9186C]/90"
                                        >
                                            Save {isLoading && <span className='loading-spinner animate-spinner'></span>}
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </Dialog.Panel>
                    </div>
                </Transition.Child>
                {/* End: Modal dialog */}
            </Dialog>
        </Transition>
    )
}

export default AddNewProjectModal