"use client"
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { Fragment } from 'react'
import { FaCopy } from 'react-icons/fa'

interface ModalProps {
    modalOpen: boolean,
    link: string,
    setModalOpen: (value: boolean) => void,
}

const ShareCourseModal = ({ modalOpen, link, setModalOpen }: ModalProps) => {
    const sharedLink = process.env.NEXT_PUBLIC_APP_URL + link;

    async function copyTextToClipboard(text: string) {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand('copy', true, text);
        }
    }

    const handleCopyClick = () => {
        // Asynchronously call copyTextToClipboard
        copyTextToClipboard(sharedLink)
            .catch((err) => {
                console.error(err);
            });
    }

    return (
        <Transition show={modalOpen} as={Fragment} >
            <Dialog as='div' onClose={() => { setModalOpen(false) }}>
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
                        <Dialog.Panel className={`relative h-max min-w-[400px] max-w-[650px] overflow-y-scroll no-scrollbar rounded-3xl shadow-2xl aspect-auto bg-[#F4F7FE] overflow-hidden px-10 pt-5 pb-8`}>
                            <Dialog.Title
                                as="h3"
                                className={"leading-loose font-semibold text-xl text-center pb-3 dark:text-black"}
                            >
                                Share your course
                            </Dialog.Title>
                            <div className='text-center cursor-pointer p-1 absolute top-4 right-5 rounded-md bg-[#D9DADD] hover:bg-[#D9DADD]/80'>
                                <X
                                    size={16}
                                    className='text-black'
                                    onClick={() => { setModalOpen(false) }}
                                />
                            </div>
                            {
                                <div className='pt-6 pb-4 px-3 flex flex-col justify-center gap-4'>
                                    <div className='self-stretch pr-0 md:pr-5 leading mb-5 dark:text-black'>
                                        <p>Generate a unique, shareable link for the course enrollment. The link should either direct students to a payment gateway (if the course is paid) or to a registration form (if the course is free).</p>
                                    </div>
                                    <div className='self-stretch pr-0 md:pr-5 leading relative'>
                                        <input
                                            type="text"
                                            name="sharedLink"
                                            value={`${sharedLink}`}
                                            readOnly
                                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500'
                                        />
                                        <button
                                            className='absolute right-8 top-[8px]'
                                            onClick={handleCopyClick}
                                        >
                                            <FaCopy size={24} className='dark:text-black' />
                                        </button>
                                    </div>
                                </div>
                            }
                        </Dialog.Panel>
                    </div>
                </Transition.Child>
                {/* End: Modal dialog */}
            </Dialog>
        </Transition>
    )
}

export default ShareCourseModal