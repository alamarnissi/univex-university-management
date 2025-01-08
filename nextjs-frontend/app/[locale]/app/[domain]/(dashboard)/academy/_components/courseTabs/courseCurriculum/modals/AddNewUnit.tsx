
import { Dialog, Transition } from "@headlessui/react"
import { X } from "lucide-react"
import { Fragment } from "react"
import DocumentPresentation from "./unitsModals/DocumentPresentation"
import VideoUnit from "./unitsModals/VideoUnit"
import TextEditorUnit from "./unitsModals/TextEditorUnit"
import { useModalStore } from "@/stores/useModalsStore"


const AddNewUnit = () => {
    const { modalOpenState, setModalOpenState , modalTypeState, actionTypeState } = useModalStore()

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
                                {actionTypeState === "addUnit" ? "Add new unit" : "Edit unit"}
                                <span className="text-[#b3b4b6] text-xs">
                                    {
                                        {
                                            "Doc_Presentation": "Document | Presentation",
                                            "Video": "Video",
                                            "Text": "Text Editor"
                                        }[modalTypeState]
                                    }
                                </span>
                            </Dialog.Title>
                            <div className='text-center cursor-pointer p-1 absolute top-4 right-5 rounded-md bg-[#D9DADD] hover:bg-[#D9DADD]/80'>
                                <X
                                    size={16}
                                    className='text-black'
                                    onClick={() => { setModalOpenState(false) }}
                                />
                            </div>

                            {
                                {
                                    "Doc_Presentation": <DocumentPresentation />,
                                    "Video": <VideoUnit />,
                                    "Text": <TextEditorUnit />
                                }[modalTypeState]
                            }

                        </Dialog.Panel>
                    </div>
                </Transition.Child>
                {/* End: Modal dialog */}
            </Dialog>
        </Transition>
    )
}

export default AddNewUnit