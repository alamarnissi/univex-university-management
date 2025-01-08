"use client"
import { useSingleCourseStore } from '@/stores/useCourseStore'
import { useModalStore } from '@/stores/useModalsStore'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

interface ModalProps {
    handleAddModule?: (value: string) => void,
    handleEditModule?: (id: string, name: string) => void,
    setSelectedModuleName: (value: string) => void,
    type: string,
    selectedModule?: string
    selectedModuleName: string
}

const AddNewModuleModal = ({ handleAddModule, handleEditModule, setSelectedModuleName, type, selectedModule, selectedModuleName }: ModalProps) => {
    const { mutate } = useSWRConfig()
    const { course_slug } = useSingleCourseStore();
    const { modalOpenState, setModalOpenState } = useModalStore()

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(type === "add") setSelectedModuleName('');
    }, [type, setSelectedModuleName]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        if (type === 'add') {
            if(handleAddModule) {
                if (selectedModuleName!.trim() !== '') {
                    await handleAddModule(selectedModuleName!);
                    setSelectedModuleName('');
                }
            }
        }  else if (type === 'edit') {
            if(handleEditModule) {
                if (selectedModuleName!.trim() !== '') {
                    await handleEditModule(selectedModule as string, selectedModuleName!);
                    setSelectedModuleName('');
                }
            }
        }
        mutate(process.env.NEXT_PUBLIC_COURSES_API_URL + `/v1/courses/get/${course_slug}`);
        setIsLoading(false);
    };

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
                        <Dialog.Panel className={`relative h-max w-full md:w-fit overflow-y-scroll no-scrollbar rounded-3xl shadow-2xl aspect-auto bg-[#F4F7FE] overflow-hidden px-10 pt-5 pb-8`}>
                            <Dialog.Title
                                as="h3"
                                className={"font-semibold text-xl text-center pb-3 dark:text-black"}
                            >
                                {type === "add" ? "Add Module" : "Edit Module"}
                            </Dialog.Title>
                            <div className='text-center cursor-pointer p-1 absolute top-4 right-5 rounded-md bg-[#D9DADD] hover:bg-[#D9DADD]/80'>
                                <X
                                    size={16}
                                    className='text-black'
                                    onClick={() => { setModalOpenState(false) }}
                                />
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className='pt-8 pb-2 px-0 md:px-3 flex flex-col justify-center gap-4'
                            >
                                <div className='self-stretch pr-0 md:pr-5 leading'>
                                    <label htmlFor="title" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                                        Module Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={selectedModuleName}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg md:min-w-[400px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Module name"
                                        onChange={(e) => setSelectedModuleName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='mt-4'>
                                    <div className='flex items-center gap-3 justify-end mt-7 md:mt-0'>
                                        <button
                                            type="button"
                                            className="text-primary inline-flex items-center hover:bg-primary/90 hover:text-white border-2 border-primary font-semibold rounded-lg text-base px-5 py-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700"
                                            onClick={() => { setModalOpenState(false) }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="disabled:cursor-not-allowed disabled:opacity-90 justify-center text-white inline-flex gap-2 items-center bg-primary hover:bg-primary/90 focus:outline-none font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700"
                                        >
                                            Save {isLoading && <span className='loading-spinner animate-spinner'></span>}
                                        </button>
                                    </div>
                                </div>
                            </form>

                        </Dialog.Panel>
                    </div>
                </Transition.Child>
                {/* End: Modal dialog */}
            </Dialog>
        </Transition>
    )
}

export default AddNewModuleModal