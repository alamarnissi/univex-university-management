"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { CollapsibleContent } from "@/components/ui/collapsible"
import { CreateLessonType, LessonDetailsType, LessonType, ReorderLessonType } from "@/lib/types/dataTypes"
import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable
} from "@hello-pangea/dnd"
import { Grip, PenLine } from "lucide-react"
import { useEffect, useState } from "react"
import { BsPlayCircle } from "react-icons/bs"
import LessonStatusSelector from "./LessonStatusSelector"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { fetchDeleteModuleLesson, fetchGetSingleLesson, fetchReorderModuleLessons, fetchUpdateLesson } from "@/lib/fetch/courses/FetchLessons"
import { useSingleCourseStore } from "@/stores/useCourseStore"
import { useToast } from "@/components/ui/toast/use-toast"
import { useSWRConfig } from "swr"
import { useModalStore } from "@/stores/useModalsStore"
import { useFilesUploadStore, useTiptapEditorStore } from "@/stores/useGlobalStore"
import ConfirmActionPopup from "@/components/Common/ConfirmDeletePopup"



const CourseModuleLessons = ({ lessons, moduleId }: { lessons: LessonType[], moduleId: string }) => {
    const { toast } = useToast();
    const { mutate } = useSWRConfig()

    const { course_id, course_slug, setSelectedLesson } = useSingleCourseStore()
    const { setEditorState } = useTiptapEditorStore()
    const { setPreviewFileState, setFileState } = useFilesUploadStore()
    const { setModalOpenState, setModalTypeState, setActionTypeState } = useModalStore()

    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const nbrLessons = lessons?.length;

    useEffect(() => {
        setIsMounted(true);
    }, []);


    const handleRemoveModule = async (lesson_id: string) => {
        setIsLoading(true)
        try {
            const response = await fetchDeleteModuleLesson(moduleId, course_id, lesson_id);
            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: "Lesson deleted successfully" });

                    let lessonsToUpdate: ReorderLessonType[] = [];
                    response.data && (response.data as ReorderLessonType[]).map((lesson, i) => {
                        // setCurrentModules(modules => [...modules, { ...module, order: i + 1 }]);
                        lessonsToUpdate.push({ ...lesson, order: i + 1 });
                    })

                    // Reorder modules after delete 
                    await fetchReorderModuleLessons(moduleId, lessonsToUpdate);

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

    const handleEditLesson = async (lessonId: string, lessonData: Partial<CreateLessonType>) => {
        const updatedLesson = { ...lessonData, moduleId, courseId: course_id };
        try {
            const response = await fetchUpdateLesson(lessonId, updatedLesson);
            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: "Lesson edited successfully" });
                } else {
                    toast({ variant: "destructive", description: "Something went wrong" });
                }
            }
        } catch (error) {
            toast({ variant: "destructive", description: "An Error Has Occurred" });
        }
    };

    const onClickEditLesson = async (lessonId: string, lessonType: string) => {
        try {
            const res = await fetchGetSingleLesson(lessonId, moduleId);

            if (res.status !== 200) {
                toast({ variant: "destructive", description: "Couldn't fetch lesson details, please try again later" });
            } else {
                setSelectedLesson(res.data as LessonDetailsType);
                setFileState(null);
                
                if (res.data?.content) {
                    setEditorState(res.data?.content);
                }

                if (res.data?.file_url) {
                    setPreviewFileState(res.data?.file_url);
                }

                setModalOpenState(true);
                setModalTypeState(lessonType);
                setActionTypeState("editUnit");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onReorder = async (updatedLessons: ReorderLessonType[]) => {
        try {
            const response = await fetchReorderModuleLessons(moduleId, updatedLessons);
            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: "Lessons reordered successfully" });
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

        const items = Array.from(lessons);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // const startIndex = Math.min(result.source.index, result.destination.index);
        // const endIndex = Math.max(result.source.index, result.destination.index);

        // const updatedChapters = items.slice(startIndex, endIndex + 1);

        const bulkUpdateData = items.map((lesson) => ({
            lesson_id: lesson.lesson_id,
            order: items.findIndex((item) => item.lesson_id === lesson.lesson_id) + 1
        }));

        onReorder(bulkUpdateData);
    }

    if (!isMounted) return null

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="modules">
                    {(provided) => (

                        <CollapsibleContent {...provided.droppableProps} ref={provided.innerRef}>
                            {nbrLessons > 0 ?
                                <>
                                    {
                                        lessons.map((lesson, i) =>
                                            <Draggable
                                                key={lesson.lesson_id}
                                                draggableId={lesson.lesson_id}
                                                index={i}
                                            >
                                                {(provided) => (
                                                    <div
                                                        key={i}
                                                        className="py-4 px-8 md:px-14 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-100/20 hover:dark:bg-gray-50/20 dark:text-white dark:border-gray-50/20"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                    >
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="flex items-center justify-start gap-4">
                                                                <div {...provided.dragHandleProps}>
                                                                    <Grip
                                                                        className="h-3.5 w-3.5 hover:bg-muted"
                                                                    />
                                                                </div>
                                                                <BsPlayCircle size={22} />
                                                                {lesson.lesson_name}
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant={"outline"}
                                                                    className="border-0 px-2 dark:bg-navy-900"
                                                                    onClick={() => { onClickEditLesson(lesson.lesson_id, lesson.lesson_type) }}
                                                                >
                                                                    <PenLine size={20} />
                                                                </Button>
                                                                <div
                                                                    className={`${buttonVariants({ variant: "outline" })} !px-0 border-0 dark:bg-navy-900`}
                                                                >
                                                                    <ConfirmActionPopup key={lesson.lesson_id} handleAction={() => handleRemoveModule(lesson.lesson_id)} />
                                                                </div>
                                                                <LessonStatusSelector
                                                                    key={lesson.lesson_id}
                                                                    lesson_id={lesson.lesson_id}
                                                                    lesson_status={lesson.lesson_status}
                                                                    handleStatusChange={handleEditLesson}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                    }
                                    {provided.placeholder}
                                </>
                                :
                                <div className="px-5 md:px-8 mt-2">
                                    <Alert variant="destructive" className='!min-w-[400px]'>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className='font-medium'>
                                            No lessons added yet
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            }
                        </CollapsibleContent>
                    )}
                </Droppable >
            </DragDropContext >

        </>
    )
}

export default CourseModuleLessons