"use client"

import Stepper from '@/components/Common/Stepper';
import { useCourseCreationStore, useCourseStepsStore } from '@/stores/useCourseStore'
import Image from 'next/image';
import { useState } from 'react';

// images 
import stepOneImg from "@/components/Common/assets/step1course.png"

const StepOne = () => {
    const { setNextStep } = useCourseStepsStore();
    const { course, updateCourseState } = useCourseCreationStore();
    const [formValue, setFormValue] = useState({
        course_name: course.course_name || "",
        course_duration: course.course_duration || 0,
        course_description: course.course_description || ""
    });

    const {course_name, course_duration, course_description} = formValue;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
          return {
            ...prevState,
            [name]: value,
          };
        });
    }

    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
          return {
            ...prevState,
            [name]: value,
          };
        });
      };

    const handleSubmit = (data: {course_name: string, course_duration: number ,course_description: string}) => {
        updateCourseState({...course, ...data})
        setNextStep()
    }

    return (
        <div className="relative p-5 bg-white rounded-lg shadow dark:bg-gray-800 md:p-8">
            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(formValue)
                }}
            >
                <div className="grid gap-x-4 gap-y-7 mb-4 md:grid-cols-4 max-w-[800px]">
                    <div className='md:col-span-2 '>
                        <label htmlFor="course_name" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white">Course Title</label>
                        <input 
                            type="text" 
                            name="course_name" 
                            id="course_name" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                            placeholder="Your Course Title" 
                            value={course_name}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="course_duration" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">Course Duration in Hours</label>
                        <input 
                            type="number" 
                            name="course_duration" 
                            id="course_duration" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                            placeholder="4" 
                            min={1}
                            value={course_duration}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <div className="md:col-span-3 md:pr-8">
                        <label htmlFor="course_description" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white">Course Description</label>
                        <textarea 
                            id="course_description" 
                            name='course_description' 
                            rows={5} 
                            maxLength={300}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                            placeholder="Write description here"
                            defaultValue={course_description}
                            onChange={handleTextAreaChange}
                        >
                        </textarea>
                    </div>
                    <div className='hidden md:block'>
                        <Image
                            src={stepOneImg}
                            alt="step one"
                            width={210}
                            height={140}
                            className="pb-5 pr-4"
                        />
                    </div>
                </div>
                <div className='grid md:grid-cols-2 gap-5 mt-6'>
                    <div>
                        <Stepper activeStep='first' />
                    </div>
                    <div className='flex items-center justify-start md:justify-end mt-7 md:mt-0'>
                        <button
                            type="submit"
                            className="text-white inline-flex items-center bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default StepOne