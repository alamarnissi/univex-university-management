import { FiSearch } from 'react-icons/fi'

const SearchBar = ({bgColor = "bg-white", placeholder = "Search...", onChange} : {bgColor?: string, placeholder?: string, onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void}) => {
  return (
    <div className={`flex h-[40px] items-center rounded-lg text-navy-700 dark:bg-gray-100 dark:text-black w-full xl:w-[255px] ${bgColor}`}>
        <p className="pl-3 pr-3 text-xl">
        <FiSearch className="h-4 w-4 text-gray-600 dark:text-black" />
        </p>
        <input
            type="text"
            placeholder={placeholder}
            onChange={onChange}
            className={`block h-full w-full rounded-2xl text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 placeholder:!text-sm dark:bg-gray-100 dark:text-black dark:placeholder:!text-black dark:!border-gray-300 focus:ring-0 focus:ring-offset-0 sm:w-fit ${bgColor}`}
        />
    </div>
  )
}

export default SearchBar