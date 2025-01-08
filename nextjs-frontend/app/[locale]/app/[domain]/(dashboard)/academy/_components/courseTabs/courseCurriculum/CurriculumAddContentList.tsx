"use client"

import React, { useState } from 'react'
import { PlusIcon } from 'lucide-react'

import TextEditorIcon from "./icons/TextEditorIcon"
import DocumentIcon from "./icons/DocumentIcon"
import VideoIcon from "./icons/VideoIcon"
import ActivityIcon from "./icons/ActivityIcon"
import ProjectIcon from "./icons/ProjectIcon"
import GenerateIcon from "./icons/GenerateLessionIcon"
import { useSingleCourseStore } from '@/stores/useCourseStore'
import { useModalStore } from '@/stores/useModalsStore'
import { useFilesUploadStore } from '@/stores/useGlobalStore'
import Dropdown from '@/components/dashboard/dropdown'

const listData = [
  {
    value: "Text",
    label: "TextEditor",
    icon: TextEditorIcon,
    iconSize: 16,
    curriculumType: "Manual"
  },
  {
    value: "Doc_Presentation",
    label: "Document|Presentation",
    icon: DocumentIcon,
    iconSize: 18,
    curriculumType: "Manual"
  },
  {
    value: "Video",
    label: "Video",
    icon: VideoIcon,
    iconSize: 16,
    curriculumType: "Manual"
  },
  {
    value: "Activity",
    label: "Activity",
    icon: ActivityIcon,
    iconSize: 16,
    curriculumType: "Manual"
  },
  {
    value: "Project",
    label: "Project",
    icon: ProjectIcon,
    iconSize: 16,
    curriculumType: "Manual"
  },
  {
    value: "generateunitai",
    label: "Generate lesson",
    icon: GenerateIcon,
    iconSize: 16,
    curriculumType: "AI_Generated"
  }
]

const CurriculumAddContentList = ({ module_id }: { module_id: string }) => {
  const { curriculum_type, setSelectedLesson, setSelectedModuleId } = useSingleCourseStore()
  const { setPreviewFileState } = useFilesUploadStore()
  const { setModalOpenState, setModalTypeState, setActionTypeState } = useModalStore()

  const [isLoading, setIsLoading] = useState(false)

  const onOpenLessonModalClick = (lessonType: string) => {
    setSelectedLesson(null);
    setPreviewFileState(null);
    setModalOpenState(true);
    setModalTypeState(lessonType);
    setActionTypeState("addUnit")
  }

  return (

    <Dropdown
      button={
        <button
          className="primary-action-btn text-xs font-medium px-2 py-1.5 bg-[#212B36] hover:bg-[#212B36]/90 dark:bg-navy-900 dark:border-navy-900 border-[#212B36] text-white"
          onClick={() => { setSelectedModuleId(module_id) }}
        >
          <PlusIcon size={14} className="mr-1" /> Add Section
        </button>
      }
      className='top-8 right-0'
    >
      <div className={` z-10 mt-2 right-0 text-sm list-none bg-white divide-y divide-gray-100 rounded-lg shadow min-w-44 w-max dark:bg-gray-700`}>
        <ul className="py-2">
          {listData.map((el, i) => (
            <div key={i} >
              {curriculum_type === "Manual" ?
                el.curriculumType === "Manual" ?
                  <li key={el.value}>
                    <button
                      type='button'
                      disabled={isLoading}
                      onClick={() => { onOpenLessonModalClick(el.value) }}
                      className="group disabled:cursor-not-allowed disabled:opacity-90 flex items-center gap-3 w-full px-4 py-2 text-sm border-2 border-transparent font-medium text-gray-700 hover:bg-gray-100 hover:border-[#D9186C4D] dark:hover:bg-gray-600 hover:text-[#D9186C] dark:text-gray-200 dark:hover:text-white"
                    >
                      <el.icon width={el.iconSize} height={el.iconSize} className={`text-[#424242] dark:text-white group-hover:text-[#D9186C]`} />
                      <span>{el.label}</span>
                    </button>
                  </li>
                  :
                  null
                :
                <li key={el.value}>
                  <button
                    type='button'
                    disabled={isLoading}
                    onClick={() => { onOpenLessonModalClick(el.value) }}
                    className="group disabled:cursor-not-allowed disabled:opacity-90 flex items-center gap-3 w-full px-4 py-2 text-sm border-2 border-transparent font-medium text-gray-700 hover:bg-gray-100 hover:border-[#D9186C4D] dark:hover:bg-gray-600 hover:text-[#D9186C] dark:text-gray-200 dark:hover:text-white"
                  >
                    <el.icon width={el.iconSize} height={el.iconSize} className={`text-[#424242] group-hover:text-[#D9186C]`} />
                    <span>{el.label}</span>
                  </button>
                </li>
              }
            </div>
          )
          )}

        </ul>
      </div>
    </Dropdown>

  )
}

export default CurriculumAddContentList