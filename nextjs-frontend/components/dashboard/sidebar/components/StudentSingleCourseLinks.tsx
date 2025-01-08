'use client'

import clsx from "clsx";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { usePathname } from 'next/navigation';
import React, { MouseEvent, useState } from "react";

import DashIcon from "@/components/dashboard/icons/DashIcon";
import { ChevronUpIcon, ChevronDownIcon, CheckCircle, Type } from "lucide-react";
import { useSidebarContext } from "@/components/providers/SidebarProvider";
import { StudentSingleCourseMenuType } from "@/lib/types/menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useSingleCourseStore } from "@/stores/useCourseStore";


type Props = {
    onClickRoute?: (e: MouseEvent<HTMLElement>) => any | any
    isCollapsed?: boolean
    setIsCollapsed: (value: boolean) => void
    routes: StudentSingleCourseMenuType[]
    role: string
}

export function StudentSingleCourseSidebarLinks({ onClickRoute, isCollapsed, setIsCollapsed, routes, role }: Props) {
    // open SubMenu
    const [openSubMenu, setOpenSubMenu] = useState(false);

    const { isCollapsedState } = useSidebarContext()
    const { course_modules, course_slug } = useSingleCourseStore()

    // Chakra color mode
    const pathname = usePathname()
    const locale = getCookie("NEXT_LOCALE");

    // verifies if routeName is the one active (in browser input)
    const activeRoute = (routeName: string) => {
        return pathname.includes(routeName);
    };

    const handleOnClick = () => {
        onClickRoute;
        setOpenSubMenu(false);
    }

    const handleSubMenuClick = () => {
        setOpenSubMenu(!openSubMenu);
        if (isCollapsedState === true) {
            setIsCollapsed(!isCollapsedState);
        }
    }

    const handleCollapseArrow = (openSubMenu: boolean) => {
        if (openSubMenu) {
            return <ChevronUpIcon size={22} className="right-5 absolute text-gray-600" />
        } else {
            return <ChevronDownIcon size={22} className="right-5 absolute text-gray-600" />
        }
    }

    const createLinks = (routes: any) => {
        return routes.map((route: any, index: number) => {

            return (
                // <Link key={index} href={route.layout + "/" + route.path}>

                <div key={index} className="relative mb-3 flex hover:cursor-pointer">
                    <li
                        className="my-[3px] cursor-pointer w-full"
                        key={index}
                    >
                        <Link
                            key={index}
                            prefetch={false}
                            href={route.name === "Course Content" ? pathname : `/academy/courses/` + course_slug + "/" + route.path}
                            onClick={() => { route.name === "Course Content" ? handleSubMenuClick() : handleOnClick(); }}
                            className="my-[3px] flex items-center px-8 w-full"
                        >
                            <span
                                className={`${activeRoute(route.path) === true
                                    ? "font-bold text-primary dark:text-white"
                                    : "font-medium text-gray-600"
                                    }`}
                            >
                                {route.icon ? route.icon : <DashIcon />}{" "}
                            </span>
                            <p
                                className={clsx(`leading-1`,
                                    activeRoute(route.path) === true ? "font-bold text-navy-700 dark:text-white" : "font-medium text-gray-600",
                                    isCollapsed ? "hidden" : "flex ml-4"
                                )}
                            >
                                {route.name}
                            </p>
                            {!isCollapsedState && route.name === "Course Content" && handleCollapseArrow(openSubMenu)}
                        </Link>
                        {route.hasChild ?
                            route.name === "Course Content" &&
                            course_modules &&
                            <ul className={`${openSubMenu ? `block` : `hidden`}  py-2 space-y-2 pl-[2rem]`}>
                                {course_modules.map((module: any) => (
                                    <li key={module.module_id} className={`${module.lessons.length > 0 ? 'block' : 'hidden'}`}>
                                        <p className="font-semibold">{module.module_name}</p>
                                        {module?.lessons.length > 0 ?
                                            module.lessons.map((lesson: any) => (
                                                <ul key={lesson.lesson_id} className="py-2 space-y-2 pl-3 mr-2">
                                                    <li className={`${lesson.lesson_status === 'draft' ? 'hidden' : 'flex'} hover:cursor-pointer bg-[#6C63FF1A] rounded-lg flex-col justify-center space-y-2 px-3 py-2`}>
                                                        <p className="max-w-[210px]">{lesson.lesson_name}</p>
                                                        <div className="flex items-center justify-between">
                                                            <p className="flex items-center gap-2 text-sm font-semibold">
                                                                <CheckCircle size={16} className="text-green-500" />
                                                                10 XP
                                                            </p>
                                                            <p className="flex items-center gap-2 text-[13px] font-semibold">
                                                                {
                                                                    {
                                                                        "Video": "Video",
                                                                        "Doc_Presentation": "Presentation",
                                                                        "Text": "Text",
                                                                    }[lesson.lesson_type as string]
                                                                } Type
                                                            </p>
                                                        </div>
                                                    </li>
                                                </ul>
                                            ))
                                            :
                                            <p className="py-2 space-y-2 pl-6 mr-2">No lessons found</p>
                                        }
                                    </li>
                                ))}
                            </ul>
                            :
                            null
                        }
                    </li>
                    {activeRoute(route.path) ? (
                        <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                    ) : null}
                </div>
            );

        });
    };

    if (routes.length === 0) {
        return (
            <div className="px-8 mx-auto flex flex-col gap-5">
                {
                    Array(5).fill(0).map((_, index) => (
                        <div key={index} className="flex items-center justify-center gap-4">
                            <Skeleton className="w-3 h-3" />
                            <Skeleton className="w-[150px] h-3" />
                        </div>
                    ))
                }
            </div>
        );
    }
    // BRAND
    return createLinks(routes);
}

export default StudentSingleCourseSidebarLinks;
