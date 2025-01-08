"use client"
import { useState } from "react"
import dynamic from "next/dynamic"
import { StudentType } from "@/lib/types/dataTypes"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { HiDocumentDownload } from "react-icons/hi"
import StudentsCourseTable from "../StudentsCourseTable"

const StudentsToCourseModal = dynamic(() => import('../modals/StudentsToCourseModal'), { ssr: false });

const CourseStudents = ({ students, role }: { students: StudentType[], role: string }) => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <div className={"flex justify-between items-start md:items-center flex-col md:flex-row my-4"}>
                <div className='flex items-center gap-5 py-4'>
                    <p className="font-semibold text-black dark:text-white">List of participants enrolled to this course</p>
                </div>

                <div className={`flex items-start md:items-center gap-5 flex-col-reverse md:flex-row py-4 w-full md:w-auto`} >
                    <div className='flex items-center gap-4'>
                        <p className='font-medium w-max text-gray-500 text-sm'>Filter by state of course:</p>
                        <Select>
                            <SelectTrigger className="w-[180px] bg-white text-gray-400 placeholder:!text-gray-400 dark:bg-gray-100 dark:text-black dark:placeholder:!text-black dark:!border-gray-300 focus:ring-0 focus:ring-offset-0">
                                <SelectValue className='' placeholder="Finished" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Filter</SelectLabel>
                                    <SelectItem value="finished">Finished</SelectItem>
                                    <SelectItem value="in-progress">In progress</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='flex items-center gap-4'>
                        <p className='font-medium w-max text-gray-500 text-sm'>Sort By:</p>
                        <Select>
                            <SelectTrigger className="w-[180px] bg-white text-gray-400 placeholder:!text-gray-400 dark:bg-gray-100 dark:text-black dark:placeholder:!text-black dark:!border-gray-300 focus:ring-0 focus:ring-offset-0">
                                <SelectValue className='' placeholder="Alphabet" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Filter</SelectLabel>
                                    <SelectItem value="alphabet">Alphanet</SelectItem>
                                    <SelectItem value="recent-access">Recent Access</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <StudentsCourseTable
                setModalOpen={setOpenModal}
                students={students}
                role={role}
            />

            {role === "manager" &&
                <div className="mb-4 w-full flex items-center justify-end">
                    <button type="button" className="flex gap-4 max-w-[175px] ease-in-up text-center flex-auto rounded-lg bg-green-500 py-3 px-6 text-base font-medium text-white transition duration-300 hover:opacity-90 hover:shadow-signUp md:px-6">
                        <HiDocumentDownload size={24} />
                        Download
                    </button>
                </div>
            }

            <StudentsToCourseModal modalOpen={openModal} setModalOpen={setOpenModal} />
        </>
    )
}

export default CourseStudents