
const ThreeDotsSpinner = () => {
    return (
        <div className='flex gap-4 items-center justify-center'>
            <div
                className="inline-block h-4 w-4 animate-skeleton-load delay-0 rounded-full bg-current dark:bg-black align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]"
                role="status">
                <span
                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span>
            </div>
            <div
                className="inline-block h-4 w-4 animate-skeleton-load delay-75 rounded-full bg-current dark:bg-black align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]"
                role="status">
                <span
                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span>
            </div>
            <div
                className="inline-block h-4 w-4 animate-skeleton-load delay-150 rounded-full bg-current dark:bg-black align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]"
                role="status">
                <span
                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span>
            </div>
        </div>
    )
}

export default ThreeDotsSpinner