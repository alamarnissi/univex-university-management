import NumbersIcon from '@/components/Common/assets/NumbersIcon'
import SpeedCounterIcon from '../../../icons/SpeedCounterIcon'
import Badge from "../../../icons/badge.png"
import Ellipse from "../../../icons/Ellipse.png"
import Image from 'next/image'
import { Check, ChevronDown, PlusCircle, Trash2 } from 'lucide-react'
import { ChevronUp } from 'lucide-react'
import { X } from 'lucide-react'
import { Plus } from 'lucide-react'
import { BsPencilSquare } from 'react-icons/bs'
import { useState } from 'react'
import ThumbDown from '@/components/Common/assets/ThumbDown'
import ThumbUp from '@/components/Common/assets/ThumbUp'
import { Button } from '@/components/ui/button'

interface Props {
    nbrQuestions: number,
    difficulty: string,
    setCurrentStep: (value: React.SetStateAction<number>) => void,
}

const QuizQuestionsData = [
    {
        id: 1,
        order: 1,
        question: "What is Machine Learning ?",
        options: [
            {
                id: 1, name: "Option 1", isCorrect: true
            },
            {
                id: 2, name: "Option 2", isCorrect: false
            },
            {
                id: 3, name: "Option 3", isCorrect: true
            },
        ],
    },
    {
        id: 2,
        order: 2,
        question: "What is Python ?",
        options: [
            {
                id: 1, name: "Option 1", isCorrect: false
            },
            {
                id: 2, name: "Option 2", isCorrect: false
            },
            {
                id: 3, name: "Option 3", isCorrect: true
            },
        ],
    }
]
const StepTwo = ({ nbrQuestions, difficulty, setCurrentStep }: Props) => {

    const [quizQuestions, setQuizQuestions] = useState(QuizQuestionsData);
    const [qstsnumber, setQstsnumber] = useState(nbrQuestions);
    const [editingOption, setEditingOption] = useState({ questionId: 0, optionId: 0 });;

    const handleStartEditOption = (questionId: number, optionId: number) => {
        setEditingOption({ questionId, optionId });
    };

    const handleCancelEditOption = () => {
        setEditingOption({ questionId: 0, optionId: 0 });
    };

    const handleSaveEditOption = (questionId: number, optionId: number, newName: string) => {
        handleEditOptionName(questionId, optionId, newName);
        setEditingOption({ questionId: 0, optionId: 0 });
    };

    const handleEditOptionName = (questionId: number, optionId: number, newName: string) => {
        setQuizQuestions((prevQuestions) => {
            return prevQuestions.map((question) => {
                if (question.id === questionId) {
                    const updatedOptions = question.options.map((option) => {
                        if (option.id === optionId) {
                            return { ...option, name: newName };
                        }
                        return option;
                    });
                    return {
                        ...question,
                        options: updatedOptions,
                    };
                }
                return question;
            });
        });
    };

    const handleAddOption = (question_id: number) => {
        const newOption = {
            id: Math.random(), name: "New Option", isCorrect: false
        }
        setQuizQuestions((prevQuestions) => {
            return prevQuestions.map((question) => {
                if (question.id === question_id) {
                    return {
                        ...question,
                        options: [...question.options, newOption],
                    };
                }
                return question;
            });
        });
    }

    const handleRemoveOption = (questionId: number, optionIdToRemove: number) => {
        setQuizQuestions((prevQuestions) => {
            return prevQuestions.map((question) => {
                if (question.id === questionId) {
                    const updatedOptions = question.options.filter(
                        (option) => option.id !== optionIdToRemove
                    );
                    return {
                        ...question,
                        options: updatedOptions,
                    };
                }
                return question;
            });
        });
    };

    const handleSetOptionIsCorrect = (questionId: number, optionId: number, isCorrectValue: boolean) => {
        setQuizQuestions((prevQuestions) => {
            return prevQuestions.map((question) => {
                if (question.id === questionId) {
                    const updatedOptions = question.options.map((option) => {
                        if (option.id === optionId) {
                            return { ...option, isCorrect: isCorrectValue };
                        }
                        return option;
                    });
                    return {
                        ...question,
                        options: updatedOptions,
                    };
                }
                return question;
            });
        });
    };

    const handleMoveQuestion = (questionId: number, direction: 'up' | 'down') => {
        setQuizQuestions((prevQuestions) => {
            const currentIndex = prevQuestions.findIndex((q) => q.id === questionId);
            const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

            if (newIndex < 0 || newIndex >= prevQuestions.length) {
                return prevQuestions; // Invalid index, do not change order
            }

            const updatedQuestions = Array.from(prevQuestions);
            const movedQuestion = updatedQuestions.splice(currentIndex, 1)[0];
            updatedQuestions.splice(newIndex, 0, movedQuestion);

            // Update the order attribute based on the new order
            updatedQuestions.forEach((question, index) => {
                question.order = index + 1; // Assuming order starts from 1
            });

            return updatedQuestions;
        });
    }

    const handleRemoveQuestion = (questionIdToRemove: number) => {
        setQstsnumber((prevQstsnumber) => prevQstsnumber - 1);
        setQuizQuestions((prevQuestions) => {
            const updatedQuestions = prevQuestions.filter(
                (question) => question.id !== questionIdToRemove
            );

            // Update the order attribute of remaining questions after removal
            updatedQuestions.forEach((question, index) => {
                question.order = index + 1; // Assuming order starts from 1
            });

            return updatedQuestions;
        });
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            id: quizQuestions.length + 1, // Assuming unique ids starting from 1
            order: quizQuestions.length + 1, // Assuming order starts from 1
            question: "New Question",
            options: [
                { id: 1, name: "Option 1", isCorrect: false },
                { id: 2, name: "Option 2", isCorrect: false },
            ],
        };

        setQuizQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    };

    const handleSubmit = () => {

    }

    return (
        <div className='flex flex-col gap-3 mt-6'>
            <div className='flex flex-col md:flex-row gap-3 bg-white rounded-2xl px-3 py-4 overflow-hidden'>
                <div className='flex flex-col gap-2'>
                    <p className='font-semibold'>
                        Multiple-choice quiz
                    </p>
                    <div className='flex items-center justify-between gap-2 text-[12.5px] font-semibold bg-[#EFEEFC] py-0.5 px-3 rounded-xl'>
                        <p className='flex items-center justify-center gap-2 border-r border-[#707070] pr-3'>
                            <NumbersIcon width={16} height={16} />
                            {qstsnumber} questions
                        </p>
                        <p className='flex items-center justify-center gap-2 border-r border-[#707070] pr-3 capitalize'>
                            <SpeedCounterIcon width={20} height={15} /> {difficulty}
                        </p>
                        <p className='flex items-center justify-center gap-2'>
                            <Image
                                src={Badge}
                                alt="badge"
                                width={28}
                                height={28}
                            />
                            +10 XP
                        </p>
                    </div>
                </div>
                <div className='hidden md:flex items-end -mb-11 -ml-3'>
                    <Image
                        src={Ellipse}
                        alt="ellipse"
                        width={140}
                        height={50}
                    />
                </div>
                <div className='flex items-end justify-start md:justify-center'>
                    <button
                        className='text-center text-white text-[15px] bg-[#D9186C] rounded-xl px-2 py-2'
                        onClick={() => setCurrentStep(3)}
                    >
                        Edit completion conditions
                    </button>
                </div>
            </div>

            <div className='flex items-center justify-center'>
                <Button
                    variant={"outline"}
                    className="rounded-full p-2"
                    onClick={handleAddQuestion}
                >
                    <Plus width={18} height={18} />
                </Button>
            </div>

            <form onSubmit={handleSubmit} className='pt-1 pb-6 px-2 flex flex-col justify-center gap-4'>
                {quizQuestions.map((question) => (
                    <div key={question.id} className='group self-stretch pr-0 md:pr-5 leading bg-white rounded-xl shadow-md'>
                        <div className='flex items-center justify-end gap-3 pt-2'>
                            <div className='flex items-center gap-3'>
                                <span
                                    className={`flex items-center p-3 bg-[#EFEEFC] hover:bg-[#EFEEFC]/80 rounded-lg cursor-pointer group-last:pointer-events-none group-last:cursor-not-allowed`}
                                    onClick={() => handleMoveQuestion(question.id, 'down')}
                                >
                                    <ChevronDown size={20} />
                                </span>
                                <span
                                    className={`${question.order === 1 ? 'pointer-events-none cursor-not-allowed' : ''} flex items-center p-3 bg-[#EFEEFC] hover:bg-[#EFEEFC]/80 rounded-lg cursor-pointer`}
                                    onClick={() => handleMoveQuestion(question.id, 'up')}
                                >
                                    <ChevronUp size={20} />
                                </span>
                            </div>
                            <div className='flex items-center gap-3 cursor-pointer' onClick={() => handleRemoveQuestion(question.id)}>
                                <Trash2 size={20} color='#C13C3C' />
                            </div>
                        </div>

                        <div className='flex flex-col gap-3 px-5 pb-5'>
                            <p className='text-[15px] font-semibold text-[#858494]'>
                                QUESTION {question.order} OF {nbrQuestions}
                            </p>
                            <p className='text-[15px] font-semibold'>
                                {question.question}
                            </p>
                            <div className='flex flex-col gap-2'>
                                {question.options.map((option, index) => (
                                    <div key={option.id} className={`${option.isCorrect ? 'bg-[#D3F4EC]' : 'bg-[#FECBCB]'} px-4 py-3.5 w-full md:w-[400px] flex items-center justify-between rounded-lg`}>
                                        <div className='flex items-center gap-3'>
                                            <input
                                                type="checkbox"
                                                name={`question-${option.id}`}
                                                id={`question-${option.id}`}
                                                checked={option.isCorrect}
                                                onChange={(e) => handleSetOptionIsCorrect(question.id, option.id, e.target.checked)}
                                                className={`w-4 h-4 border accent-[#13C296] :checked:border-[#13C296] border-[#EE8888] text-white`}
                                            />
                                            {editingOption.questionId === question.id && editingOption.optionId === option.id ? (
                                                <input
                                                    type="text"
                                                    value={option.name}
                                                    onChange={(e) => handleEditOptionName(question.id, option.id, e.target.value)}
                                                    onBlur={() => handleSaveEditOption(question.id, option.id, option.name)}
                                                    className='text-[15px] font-semibold border-none focus:outline-none focus:ring-0'
                                                />
                                            ) : (
                                                <label
                                                    htmlFor={`question-${option.id}`}
                                                    className='text-[15px] font-semibold cursor-pointer'
                                                    onDoubleClick={() => handleStartEditOption(question.id, option.id)}
                                                >
                                                    {option.name}
                                                </label>
                                            )}
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            {editingOption.questionId === question.id && editingOption.optionId === option.id ?
                                                <Check size={18} color='#858494' className='cursor-pointer' onClick={() => handleSaveEditOption(question.id, option.id, option.name)} />
                                                :
                                                <BsPencilSquare size={18} color='#858494' className='cursor-pointer' onClick={() => handleStartEditOption(question.id, option.id)} />
                                            }
                                            <X size={18} color='#858494' className='cursor-pointer' onClick={() => handleRemoveOption(question.id, option.id)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='flex items-center justify-end mb-5'>
                            <button
                                onClick={(e) => { e.preventDefault(); handleAddOption(question.id) }}
                                className='text-center text-white text-[15px] bg-primary hover:bg-primary/80 rounded-lg px-2 py-2'
                            >
                                <Plus size={20} className='inline' /> Add option
                            </button>
                        </div>
                    </div>
                ))}

                <div className='mt-4'>
                    <div className='flex items-center justify-start gap-3 md:justify-end mt-7 md:mt-0'>

                        <button
                            type="submit"
                            className="flex items-center gap-2 text-white text-[15px] bg-[#D9186C] hover:bg-[#D9186C]/90 focus:ring-4 focus:outline-none focus:ring-[#D9186C] font-semibold rounded-lg px-5 py-2.5 text-center dark:bg-[#D9186C] dark:hover:bg-[#D9186C]/90 dark:focus:ring-[#D9186C]"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>

            <div className='flex items-center justify-between py-3.5 px-5 bg-white rounded-xl shadow-md'>
                <p className='text-[#858494] text-[15px] font-semibold'>
                    Does this generated quiz was helpfull ?
                </p>
                <div className='flex items-center gap-4'>
                    <ThumbDown width={22} height={20} className='cursor-pointer self-center mt-2' />
                    <ThumbUp width={22} height={20} className='cursor-pointer self-center mb-2' />
                </div>
            </div>
        </div>
    )
}

export default StepTwo