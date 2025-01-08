import StarIcon from "@/components/Common/assets/StarIcon"
import { useModalStore } from "@/stores/useModalsStore"
import { Dialog, Transition } from "@headlessui/react"
import { HelpCircle, X } from "lucide-react"
import { Fragment, useState } from "react"
import { BsCheck } from "react-icons/bs"


const GenerateUnitAI = () => {
    const { modalOpenState, setModalOpenState , modalTypeState} = useModalStore()

    const [modules, setModules] = useState([
        {
            module_id: "module-0",
            module_name: "Module 1"
        },
        {
            module_id: "module-1",
            module_name: "Module 2"
        },
        {
            module_id: "module-2",
            module_name: "Module 3"
        }
    ])

    const [formValue, setFormValue] = useState({
        unit_name: "",
        unit_status: "draft",
        under_module: "module-0"
    })
    const { unit_name, unit_status, under_module } = formValue;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    return (
        <Transition show={modalOpenState} as={Fragment} >
            <Dialog as='div' onClose={() => { setModalOpenState(false) }}>
                {/* Modal backdrop */}
                <Transition.Child
                    className="fixed inset-0 z-[99] bg-black opacity-50 transition-opacity"
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition ease-out duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    aria-hidden="true"
                />
                {/* End: Modal backdrop */}
                {/* Modal dialog */}
                <Transition.Child
                    className="fixed inset-0 z-[999] flex p-0 md:p-6"
                    enter="transition ease-out duration-300"
                    enterFrom="opacity-0 scale-75"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-out duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-75"
                >
                    <div className="max-w-5xl mx-auto h-full flex items-center w-full md:w-auto px-5 md:px-0">
                        <Dialog.Panel className={`relative h-[600px] w-full md:w-[650px] overflow-y-scroll no-scrollbar rounded-3xl shadow-2xl aspect-auto bg-[#F4F7FE] overflow-hidden px-10 pt-5 pb-8`}>
                            <Dialog.Title
                                as="h3"
                                className={"flex flex-col items-center justify-center gap-2 font-semibold text-xl text-center pb-5 dark:text-black"}
                            >
                                Generate your lesson with AI 🤖
                            </Dialog.Title>
                            <div className='text-center cursor-pointer p-1 absolute top-4 right-5 rounded-md bg-[#D9DADD] hover:bg-[#D9DADD]/80'>
                                <X
                                    size={16}
                                    className='text-black'
                                    onClick={() => { setModalOpenState(false) }}
                                />
                            </div>
                            <div className='pt-8 pb-6 px-3 flex flex-col justify-center gap-4 bg-white shadow-md rounded-md'>
                                <div className='self-stretch pr-0 md:pr-5 leading'>
                                    <label htmlFor="status" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                                        Status
                                    </label>
                                    <div className='flex'>
                                        <div className="flex items-center mr-5 relative cursor-pointer">
                                            <input
                                                checked={unit_status === "draft"}
                                                onChange={handleChange}
                                                id="draft"
                                                type="radio"
                                                value="draft"
                                                name="unit_status"
                                                className="w-5 h-5 appearance-none rounded-sm text-primary bg-gray-100 border-gray-300 dark:bg-white dark:border-gray-600 checked:bg-primary dark:checked:bg-primary"
                                            />
                                            <label htmlFor="draft" className="flex items-center justify-between gap-4 -ml-5 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                <BsCheck size={20} className='text-gray-100' />
                                                <span>Draft</span>
                                            </label>
                                        </div>
                                        <div className="flex items-center relative cursor-pointer">
                                            <input
                                                checked={unit_status === "published"}
                                                onChange={handleChange}
                                                id="published"
                                                type="radio"
                                                value="published"
                                                name="unit_status"
                                                className="w-5 h-5 appearance-none rounded-sm text-primary bg-gray-100 border-gray-300 dark:bg-white dark:border-gray-600 checked:bg-primary dark:checked:bg-primary"
                                            />
                                            <label htmlFor="published" className="flex items-center justify-between gap-4 -ml-5 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                <BsCheck size={20} className='text-gray-100' />
                                                <span>Published</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className='self-stretch pr-0 md:pr-5 leading'>
                                    <label htmlFor="unit_name" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                                        Title
                                    </label>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        value={unit_name}
                                        name="unit_name"
                                        id="unit_name"
                                        className="bg-[#F8F9FC] border border-gray-300 text-gray-900 text-sm rounded-lg md:min-w-[400px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder=""
                                        required
                                    />
                                </div>
                                <div className='self-stretch pr-0 md:pr-5 leading'>
                                    <label htmlFor="under_module" className="flex items-center gap-3 mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                                        Under Module
                                    </label>
                                    <select
                                        name='under_module'
                                        id="under_module"
                                        onChange={handleSelectChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    >
                                        <option value="">Choose module</option>
                                        {modules.map((module) => (
                                            <option key={module.module_id} value={module.module_id}>{module.module_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='self-stretch pr-0 md:pr-5 leading'>
                                    <label htmlFor="instructions" className="relative mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                                        Give any additional instructions to the AI Assistant to generate this lesson
                                        <p className="has-tooltip inline-block mt-1 ml-2">
                                            <span className="tooltip w-max bg-white absolute bottom-7 left-0 px-3 py-2 text-center rounded-lg shadow-lg border border-[#E4E4E9] text-sm z-10">Give the AI more instructions to help you generate your lesson</span>
                                            <HelpCircle size={16} className='text-primary' />
                                        </p>
                                    </label>
                                    <textarea name="instructions" placeholder="Write your message here" cols={5} className="text-black text-[15px] w-full p-3 bg-[#F8F9FC] rounded-lg border border-[#E4E4E9]">

                                    </textarea>
                                </div>

                                <div className='mt-4'>
                                    <div className='flex items-center justify-start gap-3 md:justify-end mt-7 md:mt-0'>
                                        <button
                                            type="button"
                                            className="text-primary inline-flex items-center hover:bg-primary/90 hover:text-white border-2 border-primary font-semibold rounded-lg text-base px-5 py-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                            onClick={() => { setModalOpenState(false) }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 text-white text-[15px] bg-[#D9186C] hover:bg-[#D9186C]/90 focus:outline-none font-semibold rounded-lg px-5 py-2.5 text-center dark:bg-[#D9186C] dark:hover:bg-[#D9186C]/90"
                                        >
                                            <StarIcon />
                                            Generate
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </Dialog.Panel>
                    </div>
                </Transition.Child>
                {/* End: Modal dialog */}
            </Dialog>
        </Transition>
    )
}

export default GenerateUnitAI