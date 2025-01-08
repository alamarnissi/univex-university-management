"use client"

import React, { useRef, useState } from 'react';
import { useSWRConfig } from 'swr';
import Image from 'next/image';
import { useToast } from '@/components/ui/toast/use-toast';
import { fetchUpdateCourse, fetchUploadCourseImage } from '@/lib/fetch/courses/FetchCourses';
import { CourseDataType } from '@/lib/types/dataTypes';
import { BsCheck } from 'react-icons/bs';

const CourseSettings = ({ course, slug }: { course: CourseDataType, slug: string }) => {
    const { toast } = useToast();
    const { mutate } = useSWRConfig()

    const [formValue, setFormValue] = useState({
        course_name: course.course_name || "",
        course_duration: course.course_duration || 0,
        course_description: course.course_description || "",
        course_access: course.course_access as "Free" | "Paid",
        price: course.price || 0,
        course_type: course.course_type as "self-paced" | "cohort-based",
        promotional_image: course.promotional_image || "",
    });
    const { course_name, course_duration, course_description, course_access, price, course_type, promotional_image } = formValue;
    const imagePreview = `${process.env.NEXT_PUBLIC_GCS_URL}${process.env.NEXT_PUBLIC_GCS_BUCKET_NAME}/${promotional_image}`

    const [selectedImage, setSelectedImage] = useState<File | null>();
    const [preview, setPreview] = useState(promotional_image !== "" ? imagePreview : "");
    const iconRef = useRef<HTMLInputElement>(null!);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setPreview(URL.createObjectURL(file as Blob | MediaSource))
        validateFile(file);
    };

    const validateFile = (file: File | null) => {
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast({ variant: "destructive", description: "Please select an image file" });
            } else if (file.size > 1000000) {
                toast({ variant: "destructive", description: "File size is too large" });
            } else {
                setSelectedImage(file);
            }
        }
    };
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

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const handleSubmit = async ({ course_id, course, slug }: { course_id: string, course: CourseDataType, slug: string }) => {
        try {
            setIsLoading(true);
            let image_link = "";
            if (selectedImage) {
                // upload image 
                const uploadRes = await fetchUploadCourseImage(selectedImage, slug, "Thumbnail");

                if (uploadRes.status !== 200) throw new Error("Failed to upload");

                // set image link
                if (uploadRes.data.contentType.startsWith('image/')) {
                    image_link = uploadRes.data.fileName
                }
            }
            const courseData = image_link !== "" ? { ...course, promotional_image: image_link } : { ...course }
            const response = await fetchUpdateCourse({ course_id, course: courseData })

            if (response.status >= 200 && response.status < 300) {
                toast({ variant: "success", description: response.message });
                mutate(process.env.NEXT_PUBLIC_COURSES_API_URL + `/v1/courses/get/${slug}`)
            } else {
                toast({ variant: "destructive", description: response.message });
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            toast({ variant: "destructive", description: "An Error Has Occurred" });
        }
    }

    return (
        <form
            className='flex flex-col justify-center gap-8 w-full my-4'
            onSubmit={(event) => {
                event.preventDefault();
                handleSubmit({ course_id: course.course_id as string, course: formValue, slug })
            }}
        >
            <div className='flex items-center justify-start'>
                <p className='font-semibold text-xl dark:text-white'>Course Settings</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-5'>
                <div className="flex flex-col gap-5">
                    <div className='pr-0 md:pr-8'>
                        <label htmlFor="course_name" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-gray-400">Course Title</label>
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

                    <div className="md:col-span-3 md:pr-8">
                        <label htmlFor="course_description" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-gray-400">Course Description</label>
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

                    <div className='w-[240px] min-w-[240px]'>
                        <label className='block text-sm font-semibold text-gray-900 dark:text-gray-400'>Course Thumbnail</label>
                        <span className='block mb-3 text-sm font-medium text-gray-300 whitespace-nowrap'>upload your course image here</span>
                        <div
                            className="flex w-full items-center justify-center"
                        >
                            <label htmlFor="course-thumb" className="relative w-full h-32 cursor-pointer flex flex-col items-center justify-center bg-gray-100 border-gray-900 border-dashed border-3 rounded-sm">
                                {!preview ?
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg aria-hidden="true" className="text-black w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                    </div>
                                    :
                                    <Image
                                        src={preview}
                                        alt='course image'
                                        fill
                                    />
                                }
                                <input
                                    ref={iconRef}
                                    id="course-thumb"
                                    type="file"
                                    className="hidden"
                                    accept='image/*'
                                    onChange={handleFileInput}
                                />
                            </label>
                        </div>
                    </div>

                    <div className='w-[240px] min-w-[240px]'>
                        <label className='block text-sm font-semibold text-gray-900 dark:text-gray-400'>Video</label>
                        <span className='block mb-3 text-sm font-medium text-gray-300 whitespace-nowrap'>Upload a video from your desktop</span>
                        <div className="flex w-full items-center justify-center">
                            <label htmlFor="course-video" className="w-full h-32 cursor-pointer flex flex-col items-center justify-center bg-gray-100 border-gray-900 border-dashed border-3 rounded-sm">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg aria-hidden="true" className="text-black w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                </div>
                                <input id="course-video" type="file" accept='video/*' className="hidden" />
                            </label>
                        </div>
                    </div>

                </div>
                <div className='flex flex-col gap-5'>
                    {/* Course Free/Paid */}
                    <div className='flex flex-col items-start justify-center'>
                        <label className="block mb-3 text-sm font-semibold text-gray-900 dark:text-gray-400">
                            Change the access type for your course
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

                    {/* Course Price */}
                    {course_access === "Paid" &&
                        <div>
                            <label htmlFor="price" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-gray-400">
                                Starting Price
                            </label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="59000 DT"
                                value={price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    }

                    {/* Course Duration */}
                    <div>
                        <label htmlFor="course_duration" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-gray-400 whitespace-nowrap">Course Duration in Hours</label>
                        <input
                            type="number"
                            name="course_duration"
                            id="course_duration"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="4"
                            value={course_duration}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Course Type */}
                    <div className='self-stretch pr-0 md:pr-5 leading'>
                        <label htmlFor="course_type" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-gray-400">
                            Select the course type
                        </label>
                        <select
                            name='course_type'
                            id="course_type"
                            value={course_type ? course_type : "self-paced"}
                            onChange={handleSelectChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                            <option value={"cohort-based"} >Cohort-based</option>
                            <option value={"self-paced"} >Self-paced</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex justify-end items-center mr-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="disabled:cursor-not-allowed disabled:opacity-90 justify-center text-white inline-flex gap-2 items-center bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                    Save {isLoading && <span className='loading-spinner animate-spinner'></span>}
                </button>
            </div>
        </form>
    )
}

export default CourseSettings