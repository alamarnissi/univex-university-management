"use client"
import { useToast } from '@/components/ui/toast/use-toast'
import { fetchAddScheduleCourse } from '@/lib/fetch/courses/FetchCourses'
import { ScheduleType } from '@/lib/types/dataTypes'
import { useSingleCourseStore } from '@/stores/useCourseStore'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Fragment, useState } from 'react'
import { BsTrash } from 'react-icons/bs'

interface ModalProps {
    modalOpen: boolean,
    isScheduled: boolean,
    setModalOpen: (value: boolean) => void,
}

interface ScheduleDTOType {
    start_date: string,
    end_date: string,
    course_capacity: string,
    max_group_size: string
}

const ScheduleCourseModal = ({ modalOpen, isScheduled, setModalOpen }: ModalProps) => {

    const router = useRouter();
    const { toast } = useToast();
    const { course_slug, schedules } = useSingleCourseStore();

    const [isLoading, setIsLoading] = useState(false);
    const [formValues, setFormValues] = useState(schedules || [{
        start_date: '',
        end_date: '',
        course_capacity: "",
        max_group_size: ""
    }]);

    const addInputField = () => {
        setFormValues([...formValues, {
            start_date: '',
            end_date: '',
            course_capacity: "",
            max_group_size: ""
        }])
    }
    const removeInputFields = (index: number) => {
        const rows = [...formValues];
        rows.splice(index, 1);
        setFormValues(rows);
    }
    const handleChange = (index: number, evnt: React.ChangeEvent<any>) => {

        const { name, value } = evnt.target;
        const list = [...formValues];
        list[index][name as keyof ScheduleDTOType] = value;
        setFormValues(list);

    }

    const handleSubmit = async (ScheduleData: ScheduleType) => {
        try {
            setIsLoading(true)
            const response = await fetchAddScheduleCourse({ schedule: ScheduleData, course_slug });

            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: response.message });
                    setModalOpen(false);
                    router?.refresh();
                } else {
                    toast({ variant: "destructive", description: response.message });
                }
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            toast({ variant: "destructive", description: "An Error Has Occurred" });
            console.error(error);
        }
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
                        <Dialog.Panel className={`relative h-max min-w-[400px] w-max overflow-y-scroll no-scrollbar rounded-3xl shadow-2xl aspect-auto bg-[#F4F7FE] overflow-hidden px-10 pt-5 pb-8`}>
                            <Dialog.Title
                                as="h3"
                                className={"leading-loose font-semibold text-xl text-center pb-3 dark:text-black"}
                            >
                                {isScheduled ? "Reschedule the course" : "Schedule the course"}
                            </Dialog.Title>
                            <div className='text-center cursor-pointer p-1 absolute top-4 right-5 rounded-md bg-[#D9DADD] hover:bg-[#D9DADD]/80'>
                                <X
                                    size={16}
                                    className='text-black'
                                    onClick={() => { setModalOpen(false) }}
                                />
                            </div>

                            <div className='pt-6 pb-4 px-3 flex flex-col justify-center gap-4'>
                                <div className='self-stretch pr-0 md:pr-5 leading mb-5'>
                                    <p className='text-orange-400 font-semibold text-lg'>Your sessions:</p>
                                </div>
                                <form
                                    className='self-stretch flex flex-col justify-between gap-3'
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSubmit(formValues[0]);
                                    }}
                                >
                                    {formValues && formValues.map((data, index) => {
                                        const { start_date, end_date, course_capacity, max_group_size } = data;
                                        return (
                                            <div
                                                key={index}
                                                className='flex items-center justify-between gap-3 pb-4 border-b last:border-b-0 border-b-gray-500'
                                            >
                                                <div className='self-stretch pr-0 md:pr-5 leading relative'>
                                                    <label htmlFor="start_date" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                                                        Start Date
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        name="start_date"
                                                        id="start_date"
                                                        value={start_date}
                                                        onChange={(event) => handleChange(index, event)}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        required
                                                    />
                                                </div>

                                                <div className='self-stretch pr-0 md:pr-5 leading relative'>
                                                    <label htmlFor="end_date" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                                                        End Date
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        name="end_date"
                                                        id="end_date"
                                                        value={end_date}
                                                        onChange={(event) => handleChange(index, event)}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        required
                                                    />
                                                </div>

                                                <div className='self-stretch pr-0 md:pr-5 leading relative'>
                                                    <label htmlFor="course_capacity" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                                                        Course Capacity
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="course_capacity"
                                                        id="course_capacity"
                                                        placeholder='0'
                                                        value={course_capacity}
                                                        onChange={(event) => handleChange(index, event)}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        required
                                                    />
                                                </div>

                                                <div className='self-stretch pr-0 md:pr-5 leading relative'>
                                                    <label htmlFor="max_group_size" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                                                        Max Group Size
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="max_group_size"
                                                        id="max_group_size"
                                                        placeholder='0'
                                                        value={max_group_size}
                                                        onChange={(event) => handleChange(index, event)}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        required
                                                    />
                                                </div>

                                                {(formValues.length !== 1) ?
                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() => removeInputFields(index)}
                                                    >
                                                        <BsTrash size={20} className='text-red-500 mx-auto hover:text-red-500/80' />
                                                    </button>
                                                    :
                                                    ''
                                                }
                                            </div>
                                        )
                                    })}
                                    <div className='flex flex-col justify-center gap-3'>
                                        <p>
                                            Have a vision about future session ? Program them
                                        </p>
                                        <button
                                            className="ease-in-up text-center max-w-[250px] rounded-lg bg-blue-400 py-2 px-6 text-base font-medium text-white transition duration-300 hover:opacity-90 hover:shadow-signUp md:px-6"
                                            onClick={addInputField}
                                        >
                                            + Add New Session
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="disabled:cursor-not-allowed disabled:opacity-90 text-white max-w-[200px] self-end inline-flex gap-2 items-center bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    >
                                        Save all {isLoading && <span className='loading-spinner animate-spinner'></span>}
                                    </button>
                                </form>


                            </div>

                        </Dialog.Panel>
                    </div>
                </Transition.Child>
                {/* End: Modal dialog */}
            </Dialog>
        </Transition>
    )
}

export default ScheduleCourseModal