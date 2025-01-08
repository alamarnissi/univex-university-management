"use client"
import Image from 'next/image';
import { useSWRConfig } from 'swr';
import { useRef, useState } from 'react';
import Stepper from '@/components/Common/Stepper';
import { useCourseCreationStore, useCourseStepsStore, useCoursesControlsStore } from '@/stores/useCourseStore';
import { fetchCreateCourse, fetchPartialUpdateCourse, fetchUploadCourseImage } from '@/lib/fetch/courses/FetchCourses';
import { useToast } from '@/components/ui/toast/use-toast';

// images 
import stepThreeImg from "@/components/Common/assets/step3course.png"
import BubbleLoader from '@/components/Common/assets/BubbleLoader';

const StepThree = () => {
  const allcourses_url = process.env.NEXT_PUBLIC_COURSES_API_URL + "/v1/courses/list";

  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  const {
    statusValue,
    sortValue,
    searchValue
  } = useCoursesControlsStore()

  const { course, updateCourseState, initializeCourseState } = useCourseCreationStore();
  const { setNextStep, setPreviousStep } = useCourseStepsStore();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>();
  const [dragging, setDragging] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<Number>()
  const [preview, setPreview] = useState('')
  const iconRef = useRef<HTMLInputElement>(null!);

  const onBtnClick = () => {
    /*Collecting node-element and performing click*/
    iconRef?.current.click();
  }
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    setPreview(URL.createObjectURL(file))
    validateFile(file);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setPreview(URL.createObjectURL(file as Blob | MediaSource))
    validateFile(file);
  };

  const validateFile = async (file: File | null) => {
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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCreateCourse(course);

      if (response) {
        if (response.status >= 200 && response.status < 300) {
          if (selectedImage) {
            // upload image 
            const uploadRes = await fetchUploadCourseImage(selectedImage, response.data.slug, "Thumbnail");

            if (uploadRes.status !== 200) throw new Error("Failed to upload");

            // set image link
            if (uploadRes.data.contentType.startsWith('image/')) {
              const updateImgLink = await fetchPartialUpdateCourse({ course_id: response.data.course_id, course: { promotional_image: uploadRes.data.fileName } })
              if (updateImgLink.status !== 200) throw new Error("Failed to update image link");
            }
          }

          toast({ variant: "success", description: response.message });
          initializeCourseState();
        } else {
          toast({ variant: "destructive", description: response.message });
        }
        mutate([allcourses_url, sortValue, statusValue, searchValue]);
        setIsLoading(false);
        setNextStep();
      }
    } catch (error) {
      setIsLoading(false); // Stop loading in case of error
      toast({ variant: "destructive", description: "An Error Has Occurred" });
    }
  }

  return (
    <>
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 absolute top-0 left-0 w-full h-full z-20 bg-black/50 text-center">
          <BubbleLoader width={160} height={168} />
          <p className='text-center font-semibold text-white'>We are creating your course , please wait !</p>
        </div>
      )}

      <div className="relative p-5 bg-white rounded-lg shadow dark:bg-gray-800 md:p-8 md:pb-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="grid gap-x-4 gap-y-5 mb-5 md:grid-cols-2 max-w-[800px]">

            <div className='flex flex-col items-start justify-between gap-3 min-w-[350px]'>
              <div className='w-[240px] min-w-[240px]'>
                <label className='block text-sm font-semibold text-gray-900 dark:text-white'>Video</label>
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

              <div className='w-[240px] min-w-[240px]'>
                <label className='block text-sm font-semibold text-gray-900 dark:text-white'>Course Thumbnail</label>
                <span className='block mb-3 text-sm font-medium text-gray-300 whitespace-nowrap'>upload your course image here</span>
                <div
                  className="flex w-full items-center justify-center"
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <label htmlFor="course-thumb" className="relative w-full h-32 cursor-pointer flex flex-col items-center justify-center bg-gray-100 border-gray-900 border-dashed border-3 rounded-sm">
                    {!preview ?

                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg onClick={onBtnClick} aria-hidden="true" className="text-black w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                      accept="image/jpg, image/jpeg, image/png"
                      onChange={handleFileInput}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className='hidden md:flex items-center justify-end pt-5'>
              <Image
                src={stepThreeImg}
                alt="step three"
                width={270}
                height={190}
                className="pb-5 pr-4"
              />
            </div>
          </div>
          <div className='grid md:grid-cols-2 gap-5 mt-8'>
            <div>
              <Stepper activeStep='third' />
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
                disabled={isLoading}
                className="disabled:cursor-not-allowed disabled:opacity-90 text-white inline-flex gap-2 items-center bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Create {isLoading && <span className='loading-spinner animate-spinner'></span>}
              </button>
            </div>
          </div>
        </form>
      </div>

    </>
  )
}

export default StepThree