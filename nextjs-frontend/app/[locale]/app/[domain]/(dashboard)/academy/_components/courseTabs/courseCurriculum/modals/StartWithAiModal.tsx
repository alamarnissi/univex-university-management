import FeaturesInputField from "@/components/Common/FeaturesInputField"
import FilesInputField from "@/components/Common/FilesInputField"
import BubbleLoader from "@/components/Common/assets/BubbleLoader"
import PaperAirplane from "@/components/Common/assets/PaperAirplane"
import { useModalStore } from "@/stores/useModalsStore"
import { Dialog, Transition } from "@headlessui/react"
import { HelpCircle, X } from "lucide-react"
import { Fragment, useState } from "react"


interface ModalProps {
    handleGenerateModules: () => void
}

const StartWithAiModal = ({ handleGenerateModules }: ModalProps) => {
    const { modalOpenState, setModalOpenState , modalTypeState} = useModalStore()

    const [isLoading, setIsLoading] = useState(false)

    const [formValue, setFormValue] = useState({
        ressources: [],
        links: [],
        instructions: ""
    })
    const { ressources, links, instructions } = formValue;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            handleGenerateModules();
            setModalOpenState(false);
            setIsLoading(false);
        }, 2500);
    }

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
                        <Dialog.Panel className={`relative h-[600px] w-full md:w-[720px] overflow-y-scroll no-scrollbar rounded-3xl shadow-2xl aspect-auto bg-[#F4F7FE] overflow-hidden px-10 pt-5 pb-8`}>
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center gap-3 absolute top-0 left-0 w-full h-full z-20 bg-black/50 text-center">
                                    <BubbleLoader width={160} height={168} />
                                    <p className='text-center font-semibold text-white'>We are preparing your curriculum , please wait !</p>
                                </div>
                            )}
                            <Dialog.Title
                                as="h3"
                                className={"flex flex-col items-center justify-center gap-2 font-semibold text-xl text-center pb-5 dark:text-black"}
                            >
                                Let’s setup your AI  assistant 🤖
                            </Dialog.Title>
                            <div className='text-center cursor-pointer p-1 absolute top-4 right-5 rounded-md bg-[#D9DADD] hover:bg-[#D9DADD]/80'>
                                <X
                                    size={16}
                                    className='text-black'
                                    onClick={() => { setModalOpenState(false) }}
                                />
                            </div>
                            <form 
                                onSubmit={handleSubmit} 
                                className='pt-8 pb-6 px-3 flex flex-col justify-center gap-4 bg-white shadow-md rounded-md'
                            >
                                <div className='self-stretch pr-0 md:pr-5 leading'>
                                    <label htmlFor="ressources" className="relative mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                                        Upload any usefull  ressources as context for your AI Copilot <span className="text-[#b3b4b6]">(PDF,PPT,MP4)</span>
                                        <p className="relative has-tooltip inline-block mt-1 ml-2">
                                            <span className="tooltip w-max bg-white absolute bottom-7 right-0 px-3 py-2 text-center rounded-lg shadow-lg border border-[#E4E4E9] text-sm z-10">Give the AI more ressources to help you generate the curriculum</span>
                                            <HelpCircle size={16} className='text-primary' />
                                        </p>
                                    </label>
                                    <FilesInputField acceptTypes="application/pdf, .ppt, .pptx, video/mp4" />
                                </div>
                                <div className='self-stretch pr-0 md:pr-5 leading'>
                                    <label htmlFor="links" className="relative mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                                        Add any usefull  links  as context for your AI Copilot 
                                        <p className="has-tooltip inline-block mt-1 ml-2">
                                            <span className="tooltip w-max bg-white absolute bottom-7 left-0 px-3 py-2 text-center rounded-lg shadow-lg border border-[#E4E4E9] text-sm z-10">Give the AI more links to help you generate the curriculum</span>
                                            <HelpCircle size={16} className='text-primary' />
                                        </p>
                                    </label>
                                    <FeaturesInputField 
                                        handleChange={(value: string[]) => {}}
                                        placeholder="Paste your link here" 
                                    />
                                </div>
                                <div className='self-stretch pr-0 md:pr-5 leading'>
                                    <label htmlFor="instructions" className="relative mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                                        Give any additional instructions to the AI Assistant to generate the curriculum
                                        <p className="relative has-tooltip inline-block mt-1 ml-2">
                                            <span className="tooltip w-max bg-white absolute bottom-7 right-0 px-3 py-2 text-center rounded-lg shadow-lg border border-[#E4E4E9] text-sm z-10">Give the AI more instructions to help you generate the curriculum</span>
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
                                            previous
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 text-white text-[15px] bg-primary hover:bg-primary/90 focus:outline-none font-semibold rounded-lg px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-primary/90"
                                        >
                                            Generate curriculum
                                            <PaperAirplane width={20} height={18} />
                                        </button>
                                    </div>
                                </div>
                            </form>

                        </Dialog.Panel>
                    </div>
                </Transition.Child>
                {/* End: Modal dialog */}
            </Dialog>
        </Transition>
    )
}

export default StartWithAiModal