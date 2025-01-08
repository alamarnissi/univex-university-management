"use client"

import { useEffect, useState } from "react"
import useStore from "@/stores/useStore"
import { useSWRConfig } from "swr"
import dynamic from "next/dynamic"
import { Collapsible } from "@/components/ui/collapsible"
import { useModalStore } from "@/stores/useModalsStore"
import { useCurrentUserState } from "@/stores/useGlobalStore"
import { fetchPartialUpdateCourse } from "@/lib/fetch/courses/FetchCourses"
import { fetchCreateCourseModules, fetchDeleteCourseModules, fetchReorderCourseModules, fetchUpdateCourseModules } from "@/lib/fetch/courses/FetchModules"
import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable
} from "@hello-pangea/dnd"

import StartBlankCourseIcon from "./icons/StartBlankCourse"
import StartAIIcon from "./icons/StartAIIcon"
import ModuleCard from "./ModuleCard"
import { ModuleDataType, ReordredModuleType } from "@/lib/types/dataTypes"
import { useToast } from "@/components/ui/toast/use-toast"
import { PlusSquare } from "lucide-react"

const CourseModuleLessons = dynamic(() => import('./CourseModuleLessons'), { ssr: false });

const AddModuleModal = dynamic(() => import('./modals/AddNewModuleModal'), { ssr: false });
const ActivityGeneratorModal = dynamic(() => import('./modals/ActivityGeneratorModal'), { ssr: false });
const AddNewProjectModal = dynamic(() => import('./modals/AddNewProjectModal'), { ssr: false });
const AddNewUnit = dynamic(() => import('./modals/AddNewUnit'), { ssr: false });
const StartWithAiModal = dynamic(() => import('./modals/StartWithAiModal'), { ssr: false });
const GenerateUnitAI = dynamic(() => import('./modals/GenerateUnitAI'), { ssr: false });
const MultipleChoiceModal = dynamic(() => import('./modals/activitiesModals/multiple-choices/MultipleChoiceModal'), { ssr: false });

type CurriculumType = "Manual" | "AI_Generated"

const CourseCurriculum = ({ course_slug, course_id, modules, nbrModules }: { course_slug: string, course_id: string, modules: ModuleDataType[], nbrModules: number }) => {
    const { toast } = useToast();
    const { mutate } = useSWRConfig()

    const { modalTypeState, setModalTypeState, setModalOpenState } = useModalStore()

    const [isMounted, setIsMounted] = useState(false);
    const [typeCurriculum, setTypeCurriculum] = useState<CurriculumType | null>(null);

    const [currentModules, setCurrentModules] = useState<ModuleDataType[] | []>([]);
    const [currentNbrModules, setCurrentNbrModules] = useState(nbrModules);
    const [selectedModule, setSelectedModule] = useState("");
    const [selectedModuleName, setSelectedModuleName] = useState("");

    const [isLoading, setIsLoading] = useState(false)

    // const currentUser = useStore(useCurrentUserState, state => state.currentUser)

    useEffect(() => {
        setIsMounted(true);
    }, []);


    const handleRemoveModule = async (moduleId: string) => {
        setIsLoading(true)
        try {
            const response = await fetchDeleteCourseModules(moduleId, course_id);
            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: "Module deleted successfully" });

                    let modulesToUpdate: ModuleDataType[] = [];
                    response.data && (response.data as ModuleDataType[]).map((module, i) => {
                        // setCurrentModules(modules => [...modules, { ...module, order: i + 1 }]);
                        modulesToUpdate.push({ ...module, order: i + 1 });
                    })
                    // Reorder modules after delete 
                    await fetchReorderCourseModules(course_id, modulesToUpdate);
                    
                } else if (response.status === 400) {
                    toast({ variant: "destructive", description: "Cannot delete module with associated lessons" });
                } else {
                    toast({ variant: "destructive", description: "Something went wrong" });
                }
            }
        } catch (error) {
            toast({ variant: "destructive", description: "An Error Has Occurred" });
        }
        mutate(process.env.NEXT_PUBLIC_COURSES_API_URL + `/v1/courses/get/${course_slug}`);
        setIsLoading(false)
    }

    const handleAddModule = async (module_name: string) => {
        const newModule = {
            course_id,
            module_name,
            order: nbrModules + 1
        };
        try {
            const response = await fetchCreateCourseModules(newModule);
            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: "Module created successfully" });
                    if (typeCurriculum === "Manual") {
                        await fetchPartialUpdateCourse({ course_id, course: { curriculum_type: "Manual" } });
                    }
                    setTypeCurriculum(null);
                    setModalOpenState(false);
                } else {
                    toast({ variant: "destructive", description: "Something went wrong" });
                }
            }
        } catch (error) {
            toast({ variant: "destructive", description: "An Error Has Occurred" });
        }
    };

    const handleEditModule = async (moduleId: string, newModuleName: string) => {
        try {
            const response = await fetchUpdateCourseModules(moduleId, newModuleName);
            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: "Module edited successfully" });
                    setModalOpenState(false);
                } else {
                    toast({ variant: "destructive", description: "Something went wrong" });
                }
            }
        } catch (error) {
            toast({ variant: "destructive", description: "An Error Has Occurred" });
        }
    };

    const handleGenerateListOfModules = () => {
        const moduleNames = ["Generated Module 1", "Generated Module 2", "Generated Module 3", "Generated Module 4", "Generated Module 5"];
        const newModules = moduleNames.map((name, index) => ({
            module_id: `module-${currentModules.length + index}`,
            module_name: name,
            order: index + 1,
            lessons: [] // Empty lessons array
        }));
        setCurrentModules([...newModules]);
        setCurrentNbrModules(newModules.length);
    }

    const onReorder = async (updatedModules: ReordredModuleType[]) => {
        try {
            const response = await fetchReorderCourseModules(course_id, updatedModules);
            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: "Modules reordered successfully" });
                } else {
                    toast({ variant: "destructive", description: "Something went wrong" });
                }
            }
        } catch (error) {
            toast({ variant: "destructive", description: "An Error Has Occurred" });
        }
        mutate(process.env.NEXT_PUBLIC_COURSES_API_URL + `/v1/courses/get/${course_slug}`);
    }

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(modules);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // const startIndex = Math.min(result.source.index, result.destination.index);
        // const endIndex = Math.max(result.source.index, result.destination.index);

        // const updatedChapters = items.slice(startIndex, endIndex + 1);

        const bulkUpdateData = items.map((module) => ({
            module_id: module.module_id,
            module_name: module.module_name,
            order: items.findIndex((item) => item.module_id === module.module_id) + 1
        }));


        onReorder(bulkUpdateData);
    }

    if (!isMounted) return null

    return (
        <>
            {nbrModules > 0 ?
                <>
                    <div className={"flex justify-between items-start md:items-center flex-col md:flex-row"}>
                        <h5 className='text-gray-400 py-2'>{nbrModules} Modules</h5>
                        <div className={`flex items-center gap-3`}>
                            <div className='text-center py-2'>
                                <button
                                    className="primary-action-btn px-3 py-1.5"
                                    onClick={() => { }}
                                >
                                    Expand All
                                </button>
                            </div>

                            <div className='text-center py-2'>
                                <button
                                    className="primary-action-btn px-3 py-1.5 bg-[#D9186C] hover:bg-[#d9186c]/90 border-[#D9186C] text-white"
                                    onClick={() => { setModalOpenState(true); setModalTypeState("addModule") }}
                                >
                                    <PlusSquare size={18} className="mr-2" /> Add Section
                                </button>
                            </div>
                        </div>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="modules">
                            {(provided) => (
                                <div className="w-full mt-6" {...provided.droppableProps} ref={provided.innerRef}>

                                    {modules.map((el, i) => {
                                        return (
                                            <Collapsible key={el.module_id} className="w-full">
                                                <Draggable
                                                    draggableId={el.module_id}
                                                    index={i}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            key={i}
                                                            className="border-b-0 text-black mb-5"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                        >

                                                            <ModuleCard
                                                                key={el.module_id}
                                                                element={el}
                                                                provided={provided}
                                                                isLoading={isLoading}
                                                                handleRemove={handleRemoveModule}
                                                                setSelectedModule={setSelectedModule}
                                                                setSelectedModuleName={setSelectedModuleName}
                                                            />

                                                            <CourseModuleLessons key={i} lessons={el.lessons} moduleId={el.module_id} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            </Collapsible>
                                        )
                                    })
                                    }
                                    {provided.placeholder}

                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </>
                :
                <div className="w-full md:min-h-[320px] py-8 rounded-xl flex flex-col md:flex-row items-center justify-center gap-8">
                    <div
                        className="w-full md:w-[300px] md:min-h-[180px] p-6 flex flex-col items-center justify-center gap-3 hover:bg-gray-100 cursor-pointer shadow-lg shadow-[#979797] rounded-lg"
                        onClick={() => { setModalOpenState(true); setModalTypeState("addModule"), setTypeCurriculum("Manual") }}
                    >
                        <StartBlankCourseIcon />

                        <p className="text-base font-semibold text-[#637381] dark:text-white">Start with a blank course</p>
                    </div>

                    <div
                        className="w-full md:w-[300px] md:min-h-[180px] p-6 flex flex-col items-center justify-center gap-3 hover:bg-gray-100 cursor-pointer shadow-lg shadow-[#979797] rounded-lg"
                        onClick={() => { setModalOpenState(true); setModalTypeState("startwithAI"), setTypeCurriculum("AI_Generated") }}
                    >
                        <StartAIIcon />

                        <p className="text-base font-semibold text-[#637381] dark:text-white">Get Assisted with AI</p>
                    </div>
                </div>
            }


            {
                {
                    'addModule': <AddModuleModal
                        handleAddModule={handleAddModule}
                        setSelectedModuleName={setSelectedModuleName}
                        selectedModuleName={selectedModuleName}
                        type="add"
                    />,
                    'editModule': <AddModuleModal
                        handleAddModule={handleAddModule}
                        handleEditModule={handleEditModule}
                        setSelectedModuleName={setSelectedModuleName}
                        type="edit"
                        selectedModule={selectedModule}
                        selectedModuleName={selectedModuleName}
                    />,
                    'Activity': <ActivityGeneratorModal />,
                    'Project': <AddNewProjectModal />,
                    'Doc_Presentation': <AddNewUnit />,
                    'Video': <AddNewUnit />,
                    'Text' : <AddNewUnit />,
                    'startwithAI': <StartWithAiModal
                        handleGenerateModules={handleGenerateListOfModules}
                    />,
                    'generateunitai': <GenerateUnitAI />,
                    'multiple-choice': <MultipleChoiceModal 
                        step={1}
                    />,
                }[modalTypeState]
            }
        </>
    )
}

export default CourseCurriculum