"use client"
import { useState } from 'react';
import Image from 'next/image';

import { Listbox, Transition } from '@headlessui/react'
import { useTrackCreationStore, useTrackStepsStore } from '@/stores/useTracksStore';

// images 
import stepTwoImg from "@/components/Common/assets/step2course.png"
import { TrackCoursesList } from '@/lib/types/dataTypes';

const courses_list = [
  { course_id: "0", course_name: '', unavailable: true },
  { course_id: "1", course_name: 'Learn Python for Beginners', unavailable: false },
  { course_id: "2", course_name: 'A Simple Introduction to Lean UX', unavailable: false },
  { course_id: "3", course_name: 'Apprendre les mathématiques-cours', unavailable: false },
  { course_id: "4", course_name: 'Photographie d\'Art contemporaine et moderne', unavailable: false },
]

const StepTwo = () => {
  const { track, updateTrackState } = useTrackCreationStore();
  const { setNextStep, setPreviousStep } = useTrackStepsStore();

  const [courses, setCourses] = useState([courses_list[0] as unknown as TrackCoursesList]);


  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    setCourses((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSubmit = (data: TrackCoursesList[]) => {
    updateTrackState({ ...track, ...data });
    setNextStep();
  }

  return (
    <div className="relative p-5 bg-white rounded-lg shadow dark:bg-gray-800 md:p-8 md:pb-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(courses);
        }}
      >
        <div className="flex items-start justify-between gap-5 mb-5 max-w-[800px]">
          <div className='flex flex-col items-start gap-3 relative flex-1'>
            <Listbox value={courses} onChange={setCourses} multiple>
              <Listbox.Button>
                <input
                  className="min-w-[400px] min-h-[40px] w-full h-max text-sm border flex-shrink flex-grow flex-auto text-start leading-normal border-grey-light rounded rounded-l-none px-2 self-center relative outline-none"
                  value={courses.map((course) => course.course_name).join(', ')}
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
                  {courses_list.map((course) => (
                    <Listbox.Option
                      key={Number(course.course_id)}
                      value={course}
                      className="cursor-pointer hover:text-primary"
                    >
                      {course.course_name}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>

          <div className='hidden md:flex items-end justify-end pt-5 flex-1'>
            <Image
              src={stepTwoImg}
              alt="step two"
              width={210}
              height={140}
              className="pb-5 pr-4"
            />
          </div>
        </div>
        <div className='flex items-center justify-end mt-8'>
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
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default StepTwo