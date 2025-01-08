"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useCoursesControlsStore } from '@/stores/useCourseStore';
import { filterByStatusData, filterByProgressData } from '@/lib/data/data';
import dynamic from 'next/dynamic';

const SearchBar = dynamic(() => import('../../SearchBar'), { ssr: false })

const AllCoursesControls = ({ role }: { role: string }) => {
    const {
        isActiveValue,
        setIsActiveValue,
        setStatusValue,
        setSortValue,
        setSearchValue
    } = useCoursesControlsStore()

    const [searchState, setSearchState] = useState("");

    const searchDebounced = useDebounce<string>(searchState, 500);

    useEffect(() => {
        setSearchValue(searchDebounced);
    }, [searchDebounced, setSearchValue])

    const handleFilterChange = (slug: string) => {
        slug === "all" ? setStatusValue("") : setStatusValue(slug);

        setIsActiveValue(slug);
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearchState(value);
    }

    return (
        <div className={"flex justify-between items-start md:items-center flex-col md:flex-row my-4"}>
            <div className='flex items-center gap-5 py-4'>
                {role !== "student" ? filterByStatusData.map((el: any, i: number) =>
                    <Link
                        href={`/academy/${el.path}`}
                        key={i}
                        onClick={() => handleFilterChange(el.slug)}
                        className={`${isActiveValue == el.slug ? 'text-primary' : "text-[#C4C4C4]"} relative font-medium`}
                    >
                        {el.name}
                        <span className={`${isActiveValue == el.slug ? "absolute" : "hidden"} w-8 h-0.5 bottom-0 left-0 bg-brand-500`}></span>
                    </Link>
                )
                    : filterByProgressData.map((el: any, i: number) =>
                        <Link
                            href={`/academy/${el.path}`}
                            key={i}
                            onClick={() => {}}
                            className={`${isActiveValue == el.slug ? 'text-primary' : "text-[#C4C4C4]"} relative font-medium`}
                        >
                            {el.name}
                            <span className={`${isActiveValue == el.slug ? "absolute" : "hidden"} w-8 h-0.5 bottom-0 left-0 bg-brand-500`}></span>
                        </Link>
                    )
                }
            </div>

            <div className={`flex items-start md:items-center gap-5 flex-col-reverse md:flex-row py-4 w-full md:w-auto`} >
                {role !== "student" &&
                    <div className='flex items-center gap-4'>
                        <p className='font-medium w-max'>Sort By :</p>
                        <Select onValueChange={(val) => setSortValue(val)} defaultValue='most-recent'>
                            <SelectTrigger className="w-[180px] bg-white text-gray-400 placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white">
                                <SelectValue className='' placeholder="Most Recent" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Filter</SelectLabel>
                                    <SelectItem value="most-recent">Most Recent</SelectItem>
                                    <SelectItem value="least-recent">Least Recent</SelectItem>
                                    <SelectItem value="most-rated">Most Rated</SelectItem>
                                    <SelectItem value="least-rated">Least Rated</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                }
                <SearchBar onChange={handleSearch} />
            </div>
        </div>
    )
}

export default AllCoursesControls