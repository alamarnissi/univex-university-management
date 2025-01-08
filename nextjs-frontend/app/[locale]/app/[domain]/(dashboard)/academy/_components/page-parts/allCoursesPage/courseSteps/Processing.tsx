"use client"
import Image from 'next/image'
import {useEffect} from 'react'
import { useSWRConfig } from 'swr'
import { useCourseStepsStore, useCoursesControlsStore } from '@/stores/useCourseStore'

// images 
import stepFourImg from "@/components/Common/assets/step4processing.png"

const Processing = () => {
  const { mutate } = useSWRConfig();
  const {
    statusValue,
    sortValue,
    searchValue
  } = useCoursesControlsStore()
  const allcourses_url = process.env.NEXT_PUBLIC_COURSES_API_URL + "/v1/courses/list";

  const {
    setModalOpenState
  } = useCourseStepsStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      mutate([allcourses_url, sortValue, statusValue, searchValue]);
      setModalOpenState(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, [])

  return (
    <div className='flex flex-col justify-center items-center gap-5 px-2 md:px-10 py-8'>
      <div className='w-max'>
        <Image
          src={stepFourImg}
          alt='processing image'
          width={120}
          height={150}
        />
      </div>
      <div className='text-center dark:text-black'>
        {/* <p className='text-xl font-semibold mb-2'>Please Wait!</p> */}
        <p className='text-xl font-semibold color-green-500'>Course Created Successfully ...</p>
      </div>
    </div>
  )
}

export default Processing