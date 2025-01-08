

interface Props {
    setCurrentStep: (value: React.SetStateAction<number>) => void,
}


const EditCompleteCondition = ({ setCurrentStep }: Props) => {
    return (
        <div className='flex flex-col gap-3 mt-6'>
            <p className="text-xl font-bold">
                Edit completions conditions
            </p>
            <form className='pt-8 pb-6 px-2 flex flex-col justify-center gap-4'>
                <div className='self-stretch pr-0 md:pr-5 leading'>
                    <p>
                        This activity is considered complete and the student gain the <strong>full points</strong> when the student have <strong>a minimum score of</strong>:
                    </p>
                    <div className='flex items-center gap-3 px-3'>
                        <input type='number' name='full-points-score' value={10} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-[150px] p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500' />
                    </div>
                </div>
                <div className='self-stretch pr-0 md:pr-5 leading'>
                    <p>
                        This activity is considered complete and the student gain the <strong>half of points</strong> when the student have <strong>a minimum score of</strong>:
                    </p>
                    <div className='flex items-center gap-3 px-3'>
                        <input type='number' name='half-points-score' value={10} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-[150px] p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500' />
                    </div>
                </div>
                <div className='mt-4'>
                    <div className='flex items-center justify-start gap-3 md:justify-end mt-7 md:mt-0'>

                        <button
                            type="submit"
                            className="flex items-center gap-2 text-white text-[15px] bg-[#D9186C] hover:bg-[#D9186C]/90 focus:ring-4 focus:outline-none focus:ring-[#D9186C] font-semibold rounded-lg px-5 py-2.5 text-center dark:bg-[#D9186C] dark:hover:bg-[#D9186C]/90 dark:focus:ring-[#D9186C]"
                            onClick={() => setCurrentStep(2)}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditCompleteCondition