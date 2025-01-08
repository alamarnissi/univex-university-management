"use client"
import Image from 'next/image'
import { useEffect } from 'react'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSingleCourseStore } from '@/stores/useCourseStore'
import SearchBar from '../../../_components/SearchBar'
import { Filter } from 'lucide-react'

import Notes from "@/components/Common/assets/Notes.png"
import { NoteCard } from '../../../_components/NoteCard'

const NotesPage = ({ params: { slug } }: { params: { slug: string } }) => {
    const { setCourseSlug } = useSingleCourseStore()

    useEffect(() => {
        setCourseSlug(slug)
    }, [])

    return (
        <>
            <div className='w-full flex items-center justify-start gap-2 bg-white border border-[#6C63FFB5] rounded-lg px-5 py-4'>
                <Image
                    src={Notes}
                    alt="notes"
                    width={60}
                    height={60}
                />
                <div className='text-center px-4'>
                    <p className='font-bold text-xl md:text-2xl'>
                        Your Notes
                    </p>
                </div>
            </div>

            <div className='flex flex-col justify-center gap-4 bg-white px-6 py-8 rounded-lg mt-5'>
                <div className='flex items-center justify-between'>
                    <SearchBar bgColor='bg-gray-100' />
                    <div className='hover:cursor-pointer flex items-center justify-center w-8 h-8 mr-2 bg-gray-100 rounded-md'>
                        <Filter size={20} className="text-primary" />
                    </div>
                </div>

                <div className='w-full bg-gray-100 rounded-xl flex items-center justify-around py-6 px-5 '>
                    <div className='text-start gap-2'>
                        <p className='font-semibold text-sm'>Module :</p>
                        <Select>
                            <SelectTrigger className="w-[180px] bg-white text-gray-400 placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white focus:ring-0 focus:ring-offset-0">
                                <SelectValue className='' placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>All</SelectLabel>
                                    <SelectItem value="most-recent">Module 1</SelectItem>
                                    <SelectItem value="least-recent">Module 2</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='text-start gap-2'>
                        <p className='font-semibold text-sm'>Lesson :</p>
                        <Select>
                            <SelectTrigger className="w-[180px] bg-white text-gray-400 placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white focus:ring-0 focus:ring-offset-0">
                                <SelectValue className='' placeholder="All lessons" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>All</SelectLabel>
                                    <SelectItem value="most-recent">Lesson 1</SelectItem>
                                    <SelectItem value="least-recent">Lesson 2</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='flex items-center justify-start gap-3 md:justify-end mt-7 md:mt-0'>
                        <button
                            className="disabled:cursor-not-allowed disabled:opacity-90 text-white inline-flex justify-center gap-2 items-center bg-primary hover:bg-primary/90 focus:outline-none font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-parimary/90"
                        >
                            Apply
                        </button>
                        <button
                            type="button"
                            className="text-primary inline-flex items-center hover:bg-primary/90 hover:text-white border-2 border-primary font-semibold rounded-lg text-base px-5 py-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5'>
                    <NoteCard bgColor='bg-green-400/80' />

                    <NoteCard bgColor='bg-orange-400/80' />

                    <NoteCard bgColor='bg-red-400/80' />
                </div>
            </div>
        </>
    )
}

export default NotesPage