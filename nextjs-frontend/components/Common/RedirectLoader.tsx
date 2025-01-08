import ThreeDotsSpinner from './ThreeDotsSpinner'

const RedirectLoader = ({message}: {message: string}) => {
    return (
        <div className='flex flex-col gap-6 justify-center items-center p-8'>
            <ThreeDotsSpinner />
            <div className='flex flex-col gap-3 justify-center items-center'>
                <p className='font-semibold text-2xl dark:text-black'>Please Wait!!</p>
                <p className='text-lg text-gray-900'>{message}</p>
            </div>
        </div>
    )
}

export default RedirectLoader