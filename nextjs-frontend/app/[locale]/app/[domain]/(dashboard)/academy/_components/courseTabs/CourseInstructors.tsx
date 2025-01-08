"use client"
import { useState } from 'react'
import dynamic from 'next/dynamic'
import InstructorCard from '../InstructorCard'
import { InstructorType } from '@/lib/types/dataTypes'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

const AssignInstructorModal = dynamic(() => import('../modals/AssignInstructorModal'), { ssr: false });

const CourseInstructors = ({ instructors, course_slug, role }: { instructors: InstructorType[], course_slug: string, role: string }) => {

    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <div className={"flex justify-between items-start md:items-center flex-col md:flex-row"}>
                <h5 className='font-bold text-lg py-2 dark:text-white'>Instructors charged to this course</h5>
                {role === "manager" &&
                    <div className='text-center py-2'>
                        <button
                            className="primary-action-btn"
                            onClick={() => { setOpenModal(true) }}
                        >
                            + Assign Instructor
                        </button>
                    </div>
                }
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-5 py-3 md:py-8`}>

                {instructors?.length >= 1 ? instructors.map((el) => (
                    <InstructorCard
                        instructor={{
                            instructor_id: el.instructor_id,
                            username: el.instructor_name,
                            profession: el.profession,
                            role: el.role,
                            profile_image: el.profile_image
                        }}
                        course_slug={course_slug}
                        role={role}
                        key={el.instructor_id}
                    />
                ))
                    :
                    <Alert variant="destructive" className='!min-w-[400px]'>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className='font-medium'>
                            No Instructor assigned to this course
                        </AlertDescription>
                    </Alert>
                }
            </div>
            <AssignInstructorModal
                modalOpen={openModal}
                setModalOpen={setOpenModal}
            />
        </>
    )
}

export default CourseInstructors