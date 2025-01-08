"use client"

import Image from 'next/image';
import { useState } from 'react';
import Stepper from '@/components/Common/Stepper';

// images 
import stepOneImg from "@/components/Common/assets/step1course.png";
import { useTrackCreationStore, useTrackStepsStore } from '@/stores/useTracksStore';

const StepOne = () => {
    const { setNextStep } = useTrackStepsStore();
    const { track, updateTrackState } = useTrackCreationStore();
    const [formValue, setFormValue] = useState({
        track_name: track.track_name || "",
        track_description: track.track_description || ""
    });

    const {track_name, track_description} = formValue;

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

    const handleSubmit = (data: {track_name: string, track_description: string}) => {
        updateTrackState({...track, ...data})
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
                        <label htmlFor="track_name" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white">Track Title</label>
                        <input 
                            type="text" 
                            name="track_name" 
                            id="track_name" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                            placeholder="Your Track Title" 
                            value={track_name}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <div className="md:col-span-3 md:pr-8">
                        <label htmlFor="track_description" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white">Track Overview</label>
                        <textarea 
                            id="track_description" 
                            name='track_description' 
                            rows={5} 
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                            placeholder="Write description here"
                            defaultValue={track_description}
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
                <div className='flex items-center justify-end mt-6'>
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