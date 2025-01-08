"use client"
import { useControlsStore } from '@/stores/useGlobalStore'
import SearchBar from '../../SearchBar'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from 'react'
import { useDebounce } from '@/lib/hooks/useDebounce'

const PageControls = () => {

    const {
        setSearchValue,
        setSortValue
    } = useControlsStore()

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
        <div className={`flex flex-col md:flex-row items-start md:items-center justify-between my-4`}>
            <SearchBar onChange={handleSearch} bgColor='bg-gray-200' />

            <div className={`flex items-start md:items-center gap-5 flex-col-reverse md:flex-row py-4 w-full md:w-auto`} >
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
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}

export default PageControls