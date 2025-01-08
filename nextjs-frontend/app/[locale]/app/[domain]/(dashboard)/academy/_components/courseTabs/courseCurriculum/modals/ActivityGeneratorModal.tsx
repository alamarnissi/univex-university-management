"use client"
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { Fragment } from 'react'

import { X } from 'lucide-react'
import DragDropIcon from "../icons/DragDropIcon"
import EssayIcon from "../icons/EssayQuIcon"
import FillInBlankIcon from "../icons/FillBlanksIcon"
import FlashCardsIcon from "../icons/FlashCardsIcon"
import ImgBasedIcon from "../icons/ImgBasedQu"
import MultipleChoiceIcon from "../icons/MultipleChoiceIcon"
import ProgrammingIcon from "../icons/ProgQuIcon"
import TrueFalseIcon from "../icons/TrueFalseIcon"
import StarsIcon from "../icons/stars.png"
import { useModalStore } from '@/stores/useModalsStore'

type ActivityProps = {
    id: string,
    name: string,
    image: any,
    imgSize: number,
    type: string,
    isReady: boolean
}

const activityData: ActivityProps[] = [
    {
        id: "activity-1",
        name: "Multiple-choice questions",
        image: MultipleChoiceIcon,
        imgSize: 140,
        type: "multiple-choice",
        isReady: true
    },
    {
        id: "activity-2",
        name: "True/false questions",
        image: TrueFalseIcon,
        imgSize: 140,
        type: "true-false",
        isReady: true
    },
    {
        id: "activity-3",
        name: "Fill in the blanks",
        image: FillInBlankIcon,
        imgSize: 140,
        type: "fill-in-the-blanks",
        isReady: false
    },
    {
        id: "activity-4",
        name: "Flashcards",
        image: FlashCardsIcon,
        imgSize: 140,
        type: "flash-cards",
        isReady: false
    },
    {
        id: "activity-5",
        name: "Drag-and-drop questions",
        image: DragDropIcon,
        imgSize: 140,
        type: "drag-drop",
        isReady: false
    },
    {
        id: "activity-6",
        name: "Image-based questions",
        image: ImgBasedIcon,
        imgSize: 140,
        type: "image-based",
        isReady: false
    },
    {
        id: "activity-7",
        name: "Essay questions",
        image: EssayIcon,
        imgSize: 140,
        type: "essay",
        isReady: false
    },
    {
        id: "activity-8",
        name: "Programming questions",
        image: ProgrammingIcon,
        imgSize: 140,
        type: "programming",
        isReady: false
    }
]

const ActivityGeneratorModal = () => {
    const { modalOpenState, setModalOpenState , setModalTypeState} = useModalStore()

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
                        <Dialog.Panel className={`relative h-max w-fit overflow-hidden no-scrollbar rounded-3xl shadow-2xl aspect-auto bg-[#F4F7FE] px-10 pt-5 pb-8`}>
                            <Dialog.Title
                                as="h3"
                                className={"flex items-center justify-center gap-3 font-semibold text-xl text-center pb-3 dark:text-black"}
                            >
                                <Image
                                    src={StarsIcon}
                                    alt="Stars"
                                    width={40}
                                    height={40}
                                />
                                Activity Generator
                            </Dialog.Title>
                            <div className='text-center cursor-pointer p-1 absolute top-4 right-5 rounded-md bg-[#D9DADD] hover:bg-[#D9DADD]/80'>
                                <X
                                    size={16}
                                    className='text-black'
                                    onClick={() => { setModalOpenState(false) }}
                                />
                            </div>

                            <div className='pt-8 md:pt-12 pb-8 md:pb-12 px-3 grid grid-cols-4 justify-center gap-x-6 gap-y-10'>
                                {activityData.map((activity: ActivityProps) => (
                                    <div
                                        key={activity.id}
                                        onClick={() => { setModalTypeState(activity.type) }}
                                        className={`${!activity.isReady ? "opacity-60 cursor-not-allowed pointer-events-none" : ""} group flex flex-col justify-center h-[200px] text-center items-center gap-3 bg-[#EFEEFCE5] text-[#6A5AE0] rounded-3xl px-4 py-6 cursor-pointer shadow-md hover:text-white hover:bg-[#FF8FA2E5]`}
                                    >
                                        <div className='w-16 h-14 bg-white rounded-lg shadow-lg flex items-center justify-center group-hover:bg-[#FFA5B533]'>
                                            <activity.image width={activity.imgSize} height={activity.imgSize} className={`text-[#6A5AE0] group-hover:text-white`} />
                                        </div>

                                        <p className='text-sm whitespace-nowrap font-semibold dark:text-white'>{activity.name}</p>
                                    </div>
                                ))}
                            </div>

                        </Dialog.Panel>
                    </div>
                </Transition.Child>
                {/* End: Modal dialog */}
            </Dialog>
        </Transition>
    )
}

export default ActivityGeneratorModal