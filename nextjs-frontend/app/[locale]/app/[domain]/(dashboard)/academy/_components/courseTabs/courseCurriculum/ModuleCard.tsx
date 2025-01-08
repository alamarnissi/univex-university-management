import { Grip, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import ModuleFolderIcon from './icons/ModuleFolderIcon'
import CurriculumAddContentList from './CurriculumAddContentList'
import { BsThreeDotsVertical } from 'react-icons/bs'
import CollapseTrigger from './CollapseTrigger'
import { MdEditNote } from 'react-icons/md'
import { useModalStore } from '@/stores/useModalsStore'
import { CollapsibleTrigger } from '@/components/ui/collapsible'
import Dropdown from '@/components/dashboard/dropdown'


interface Props {
    element: {
        module_id: string
        module_name: string
        lessons: any
    }
    provided: any,
    isLoading: boolean,
    handleRemove: (value: string) => void,
    setSelectedModule: (value: string) => void
    setSelectedModuleName: (value: string) => void
}

const ModuleCard = ({ element, provided, isLoading, handleRemove, setSelectedModule, setSelectedModuleName }: Props) => {
    const { setModalOpenState, setModalTypeState } = useModalStore()
    const [isCollapsed, setIsCollapsed] = useState(false);

    const openEditModule = (moduleId: string, moduleName: string) => {
        setModalOpenState(true);
        setModalTypeState("editModule");
        setSelectedModule(moduleId);
        setSelectedModuleName(moduleName);
    }

    return (
        <div
            className="relative py-4 px-5 md:px-8 rounded-lg bg-gray-100/40 dark:bg-navy-700 gap-4"
        >
            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between gap-4 md:gap-0">
                <CollapsibleTrigger
                    className="flex justify-start items-center gap-7"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <div {...provided.dragHandleProps}>
                        <Grip
                            className="h-5 w-5 hover:bg-muted dark:text-white"
                        />
                    </div>
                    <div onDoubleClick={() => openEditModule(element.module_id, element.module_name)} className="flex items-center justify-between gap-3.5 cursor-pointer font-semibold dark:text-white">
                        <span className="block min-w-5 min-h-5"><ModuleFolderIcon /></span>

                        <span>{element.module_name}</span>

                        <span className="text-[#b3b4b6] text-xs hidden md:block">
                            {element.lessons.length} lessons
                        </span>
                    </div>
                </CollapsibleTrigger>

                <div className="flex items-center gap-2">
                    <CurriculumAddContentList module_id={element.module_id} />
                    <Dropdown
                        button={
                            <BsThreeDotsVertical
                                size={24}
                                className="cursor-pointer dark:text-white"
                            />
                        }
                        className={`right-0 top-8`}
                    >
                        {/*Dropdown menu*/}
                        <div className={` z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow min-w-44 w-max dark:bg-gray-700`}>
                            <ul className="py-2">
                                <li>
                                    <button
                                        onClick={() => openEditModule(element.module_id, element.module_name)}
                                        className="flex items-center gap-3 px-4 py-2 text-sm w-full text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                    >
                                        <MdEditNote size={20} /> <span>Edit</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type='button'
                                        disabled={isLoading}
                                        onClick={() => handleRemove(element.module_id)}
                                        className="disabled:cursor-not-allowed disabled:opacity-90 flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                    >
                                        <Trash2 size={20} /> <span>Delete Module</span> {isLoading && <span className='loading-spinner !border-gray-400 !border-t-primary !w-3 !h-3 animate-spinner'></span>}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </Dropdown>

                    <CollapseTrigger
                        id_item={element.module_id}
                        isCollapsed={isCollapsed}
                        onClickCollapse={() => setIsCollapsed(!isCollapsed)}
                    />
                </div>
                <span className="text-[#b3b4b6] text-xs block md:hidden">
                    {element.lessons.length} lessons
                </span>
            </div>
        </div>
    )
}

export default ModuleCard