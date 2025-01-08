"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useTracksControlsStore } from '@/stores/useTracksStore';
import SearchBar from '../../SearchBar';

const AllTracksControls = () => {
    const {
        setSortValue,
        setSearchValue
    } = useTracksControlsStore();

    const [searchState, setSearchState] = useState("");

    const searchDebounced = useDebounce<string>(searchState, 500);

    useEffect(() => {
        setSearchValue(searchDebounced);
    }, [searchDebounced])

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearchState(value);
    }

  return (
    <div className={"flex justify-between items-start md:items-center flex-col md:flex-row my-4"}>
            <div className='flex items-center gap-5 py-4'>
                <Link
                    href={`/academy/?trackStatus=all`}
                    className={`text-primary text-lg relative font-medium`}
                >
                    All Tracks
                    <span className={`absolute w-8 h-0.5 bottom-0 left-0 bg-brand-500`}></span>
                </Link>
            </div>

            <div className={`flex items-start md:items-center gap-5 flex-col-reverse md:flex-row-reverse py-4 w-full md:w-auto`} >
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
                                <SelectItem value="most-rated">Most Rated</SelectItem>
                                <SelectItem value="least-rated">Least Rated</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <SearchBar onChange={handleSearch} />
            </div>
        </div>
  )
}

export default AllTracksControls