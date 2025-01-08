"use client"
import { useState } from 'react';
import Image from 'next/image';

import Stepper from '@/components/Common/Stepper';
import { useCourseCreationStore, useCourseStepsStore } from '@/stores/useCourseStore';

import { FaChevronRight } from 'react-icons/fa';
import { BsCheck } from 'react-icons/bs';

// images 
import stepTwoImg from "@/components/Common/assets/step2course.png"

const StepTwo = () => {
  const { course, updateCourseState } = useCourseCreationStore();
  const { setNextStep, setPreviousStep } = useCourseStepsStore();

  const [formValue, setFormValue] = useState({
    course_access: course.course_access as "Free" | "Paid",
    price: course.price || 0,
    course_level: course.course_level as "Beginner" | "Medium" | "Advanced",
    course_type: course.course_type as "self-paced" | "cohort-based",
    preferred_currency: course.preferred_currency as "TND" | "USD" | "EURO" || "TND" 
  });

  const { course_access, price, course_level, course_type, preferred_currency } = formValue;

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

  const handleSubmit = (data: { course_access: "Free" | "Paid", price: number, course_level: "Beginner" | "Medium" | "Advanced", course_type: "self-paced" | "cohort-based", preferred_currency: "TND" | "USD" | "EURO" }) => {
    updateCourseState({ ...course, ...data });
    setNextStep();
  }

  return (
    <div className="relative p-5 bg-white rounded-lg shadow dark:bg-gray-800 md:p-8 md:pb-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(formValue);
        }}
      >
        <div className="grid gap-x-4 gap-y-5 mb-5 md:grid-cols-2 max-w-[800px]">
          {/* Course Free/Paid */}
          <div className='flex flex-col items-start justify-center order-2 md:order-1'>
            <label className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Select the access type for your course
            </label>
            <div className='flex'>
              <div className="flex items-center mr-5 relative cursor-pointer">
                <input
                  checked={course_access === "Paid"}
                  onChange={handleChange}
                  id="paid"
                  type="radio"
                  value="Paid"
                  name="course_access"
                  className="w-5 h-5 appearance-none rounded-sm text-primary bg-gray-100 border-gray-300 dark:bg-white dark:border-gray-600 checked:bg-primary dark:checked:bg-primary"
                />
                <label htmlFor="paid" className="flex items-center justify-between gap-4 -ml-5 text-sm font-medium text-gray-900 dark:text-gray-300">
                  <BsCheck size={20} className='text-gray-100' />
                  <span>Paid</span>
                </label>
              </div>
              <div className="flex items-center relative cursor-pointer">
                <input
                  checked={course_access === "Free"}
                  onChange={handleChange}
                  id="Free"
                  type="radio"
                  value="Free"
                  name="course_access"
                  className="w-5 h-5 appearance-none rounded-sm text-primary bg-gray-100 border-gray-300 dark:bg-white dark:border-gray-600 checked:bg-primary dark:checked:bg-primary"
                />
                <label htmlFor="Free" className="flex items-center justify-between gap-4 -ml-5 text-sm font-medium text-gray-900 dark:text-gray-300">
                  <BsCheck size={20} className='text-gray-100' />
                  <span>Free</span>
                </label>
              </div>
            </div>
          </div>

          <div className='order-1 md:order-2'>
            <div role="alert" className="relative flex items-center justify-center w-full text-base font-regular px-3.5 py-4 rounded-lg border border-red-500 bg-red-300/20 text-red-700 " data-projection-id="18">
              <div className='shrink-0 flex items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path>
                </svg>
              </div>
              <div className="ml-2 mr-5"><span className='text-sm font-medium'>You need to setup your payment method !</span></div>
              <div className='shrink-0 flex items-center justify-center rounded-full bg-red-500 text-white h-6 w-6 text-center'>
                <FaChevronRight height={16} width={18} />
              </div>
            </div>
          </div>
          <div className='flex flex-col items-start justify-between gap-3 order-3'>
            {course_access === "Paid" &&
              <div className='flex items-center justify-between gap-2 transition ease-in delay-500'>
                {/* Course Price */}
                <div>
                  <label htmlFor="price" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                    What is the price of the course?
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="12300 DT"
                    value={price}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* Course Current */}
                <div>
                  <label htmlFor="preferred_currency" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Select your currency
                  </label>
                  <select
                    value={preferred_currency ? preferred_currency : "TND"}
                    name='preferred_currency'
                    id="preferred_currency"
                    onChange={handleSelectChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option value={"TND"}>TND</option>
                    <option value={"USD"}>USD</option>
                    <option value={"EURO"}>EURO</option>
                  </select>
                </div>
              </div>
            }
            {/* Course Difficulty */}
            <div className='self-stretch pr-0 md:pr-5 leading'>
              <label htmlFor="course_level" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                Select the course difficulty
              </label>
              <select
                value={course_level ? course_level : "Beginner"}
                name='course_level'
                id="course_level"
                onChange={handleSelectChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option value={"Beginner"}>Beginner</option>
                <option value={"Medium"}>Medium</option>
                <option value={"Advanced"}>Advanced</option>
              </select>
            </div>

            {/* Course Type */}
            <div className='self-stretch pr-0 md:pr-5 leading'>
              <label htmlFor="course_type" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                Select the course type
              </label>
              <select
                value={course_type ? course_type : "self-paced"}
                name='course_type'
                id="course_type"
                onChange={handleSelectChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option value={"cohort-based"}>Cohort-based</option>
                <option value={"self-paced"}>Self-paced</option>
              </select>
            </div>
          </div>

          <div className='hidden md:flex items-end justify-end pt-5 order-4'>
            <Image
              src={stepTwoImg}
              alt="step two"
              width={210}
              height={140}
              className="pb-5 pr-4"
            />
          </div>
        </div>
        <div className='grid md:grid-cols-2 gap-5 mt-8'>
          <div>
            <Stepper activeStep='second' />
          </div>
          <div className='flex items-center justify-start md:justify-end gap-4 mt-7 md:mt-0'>
            <button
              type="button"
              className="text-primary inline-flex items-center hover:bg-primary/90 hover:text-white border-2 border-primary font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              onClick={() => setPreviousStep()}
            >
              Previous
            </button>
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

export default StepTwo