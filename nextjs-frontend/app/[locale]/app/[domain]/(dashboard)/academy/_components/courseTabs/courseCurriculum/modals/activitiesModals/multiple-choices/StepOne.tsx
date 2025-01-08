import { Fragment, useState } from 'react'
import Image from 'next/image'

import { Listbox, Transition } from '@headlessui/react';
import DescFileIcon from '@/components/Common/assets/DescFileIcon';
import NumbersIcon from '@/components/Common/assets/NumbersIcon';
import ClockIcon from '@/components/Common/assets/ClockIcon';
import GradesIcon from '@/components/Common/assets/GradesIcon';
import TaskCompleteIcon from '@/components/Common/assets/TaskCompleteIcon';
import StarIcon from '@/components/Common/assets/StarIcon';
import Processing from './Processing';
import { useMultiChoiceActivityStore } from '@/stores/useCourseStore';
import Character1 from "@/components/Common/assets/Character1.png";
import Character2 from "@/components/Common/assets/Character2.png";
import Character3 from "@/components/Common/assets/Character3.png";
import { useModalStore } from '@/stores/useModalsStore';

interface Props {
    isLoading: boolean,
    setIsLoading: (value: React.SetStateAction<boolean>) => void,
    setCurrentStep: (value: React.SetStateAction<number>) => void,
}

const grading_options = [
    { id: 1, name: 'Correct Answer Only', unavailable: false },
    { id: 2, name: 'Partial Credit', unavailable: false },
]

const DifficultyOptions = [
    { id: 1, name: 'Easy', bgColor: 'bg-[#E2FFF7]', img: Character3 },
    { id: 2, name: 'Medium', bgColor: 'bg-[#FFF8E4]', img: Character2 },
    { id: 3, name: 'Hard', bgColor: 'bg-[#FFEBE4]', img: Character1 },
]

const StepOne = ({ isLoading, setIsLoading, setCurrentStep }: Props) => {
    const [openQuizTime, setOpenQuizTime] = useState(false);
    const [formValue, setFormValue] = useState({
        nbrQuestions: 10,
        quizTime: 30,
        difficulty: DifficultyOptions[0].name,
        gradingOption: grading_options[0]
    });
    const {
        nbrQuestions,
        quizTime,
        difficulty,
        gradingOption
    } = formValue;

    const { setNbrQuestions, setDifficulty } = useMultiChoiceActivityStore();
    const { setModalOpenState, setModalTypeState } = useModalStore();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setNbrQuestions(nbrQuestions);
        setDifficulty(difficulty);
        setTimeout(() => {
            setCurrentStep(2);
            setIsLoading(false);
        }, 2500);

    }

    if (isLoading) {
        return (
            <Processing />
        )
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)} className='pt-8 pb-6 px-3 flex flex-col justify-center gap-4 bg-white shadow-md rounded-md'>
            <div className='self-stretch pr-0 md:pr-5 leading'>
                <label htmlFor="name" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                    <span className="flex items-center p-3 bg-[#EFEEFC] rounded-lg">
                        <DescFileIcon />
                    </span>
                    <div className='flex flex-col'>
                        <span>
                            Content Scope
                        </span>
                        <span className='text-gray-400'>
                            Select the specific sections or modules to consider when generating quiz questions
                        </span>
                    </div>
                </label>
                <input type="text" name="name" id="name" className="bg-[#F8F9FC] border border-gray-300 text-gray-900 text-sm rounded-lg md:min-w-[400px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
            </div>
            <div className='self-stretch pr-0 md:pr-5 leading'>
                <label htmlFor="desc" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                    <span className="flex items-center p-3 bg-[#EFEEFC] rounded-lg">
                        <NumbersIcon width={22} height={22} />
                    </span>
                    Number of questions
                </label>
                <div>
                    <input
                        type='number'
                        name='nbrQuestions'
                        value={nbrQuestions}
                        min={1}
                        max={10}
                        onChange={handleChange}
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-[150px] p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500'
                    />
                </div>
            </div>
            <div className='self-stretch pr-0 md:pr-5 leading'>
                <label htmlFor="keywords" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                    <span className="flex items-center p-3 bg-[#EFEEFC] rounded-lg">
                        <ClockIcon />
                    </span>
                    Timed quiz
                </label>
                <div className='flex flex-col gap-2'>

                    <label
                        htmlFor='isTimed'
                        className='group flex items-center justify-start gap-2 p-4 bg-[#F8F9FC] w-full md:w-[400px] rounded-xl'
                    >
                        <input onChange={() => { setOpenQuizTime(!openQuizTime) }} type='checkbox' id='isTimed' className='w-5 h-5 accent-primary group-hover:accent-primary/80 dark:accent-primary focus:accent-primary' />
                        <span className='ml-3 text-sm font-medium'>
                            It&apos;s a timed quiz
                        </span>
                    </label>
                    {openQuizTime &&
                        <div className='flex items-center gap-3 px-3'>
                            <input type='number' name='timed-quiz' value={quizTime} onChange={handleChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-[150px] p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500' />
                            <span className='text-sm font-semibold'>
                                Minutes
                            </span>
                        </div>
                    }

                </div>
            </div>
            <div className='self-stretch pr-0 md:pr-5 leading'>
                <label htmlFor="keywords" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                    <span className="flex items-center p-3 bg-[#EFEEFC] rounded-lg">
                        <GradesIcon />
                    </span>
                    Difficulty Level
                </label>
                <div className='flex items-center gap-3'>
                    {DifficultyOptions.map((option, index) => (

                        <label
                            key={option.id}
                            htmlFor={option.name}
                            className={`${difficulty === option.name ? '!border-[#D9186C] !text-[#D9186C]' : ''} group flex items-center justify-start p-2 text-black border border-[#F8F9FC] bg-[#F8F9FC] hover:border-[#D9186C] hover:text-[#D9186C] rounded-xl`}
                        >
                            <div className='flex flex-col justify-center items-center gap-2 cursor-pointer w-[100px] rounded-xl'>
                                <div className={`w-fit p-1 px-1.5 rounded-full ${option.bgColor}`}>
                                    <Image
                                        src={option.img}
                                        alt={option.name}
                                        width={24}
                                        height={30}
                                    />
                                </div>
                                <span className='text-sm font-semibold'>
                                    {option.name}
                                </span>
                            </div>
                            <input
                                type='radio'
                                id={option.name}
                                name='difficulty'
                                className='hidden'
                                value={option.name}
                                onChange={() => setFormValue((prev) => { return { ...prev, difficulty: option.name } })}
                            />
                        </label>
                    ))}

                </div>
            </div>
            <div className='self-stretch pr-0 md:pr-5 leading'>
                <label htmlFor="relatedRes" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                    <span className="flex items-center p-3 bg-[#EFEEFC] rounded-lg">
                        <TaskCompleteIcon />
                    </span>
                    <div className='flex flex-col'>
                        <span>
                            Grading options
                        </span>
                        <span className='text-gray-400'>
                            specify the grading options
                        </span>
                    </div>
                </label>
                <div className='relative w-full md:w-[400px]'>
                    <Listbox
                        value={gradingOption}
                        onChange={(gradingOption) => setFormValue((prev) => { return { ...prev, gradingOption } })}
                    >
                        <Listbox.Button
                            as={Fragment}
                        >
                            <input
                                type="text"
                                readOnly
                                required
                                placeholder='Select a grading logic'
                                name="gradingOption"
                                className="flex-shrink flex-grow flex-auto cursor-pointer text-start text-[15px] font-medium text-gray-800 placeholder:text-gray-600 rounded-lg bg-[#F8F9FC] leading-normal w-full border-0 h-10 border-grey-light px-4 py-2 self-center relative outline-none dark:text-gray-600"
                                value={gradingOption.name}
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
                                {grading_options.map((option) => (
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
                        onClick={() => { setModalOpenState(true); setModalTypeState("Activity"); }}
                    >
                        Change Activity
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 text-white text-[15px] bg-[#D9186C] hover:bg-[#D9186C]/90 focus:ring-4 focus:outline-none focus:ring-[#D9186C] font-semibold rounded-lg px-5 py-2.5 text-center dark:bg-[#D9186C] dark:hover:bg-[#D9186C]/90 dark:focus:ring-[#D9186C]"
                    >
                        <StarIcon />
                        Generate
                    </button>
                </div>
            </div>
        </form>
    )
}

export default StepOne