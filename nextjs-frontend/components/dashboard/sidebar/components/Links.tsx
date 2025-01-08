'use client'

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import React, { MouseEvent, useState } from "react";

import DashIcon from "@/components/dashboard/icons/DashIcon";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { useSidebarContext } from "@/components/providers/SidebarProvider";
import { DashboardMenuType } from "@/lib/types/menu";
import { Skeleton } from "@/components/ui/skeleton";


type Props = {
  onClickRoute?: (e: MouseEvent<HTMLElement>) => any | any
  isCollapsed?: boolean
  subdomain: string
  routes: DashboardMenuType[]
  role: string
}

export function SidebarLinks({ onClickRoute, subdomain, isCollapsed, routes, role }: Props) {
  // open SubMenu
  const [openSubMenu, setOpenSubMenu] = useState(false);

  const { isCollapsedState } = useSidebarContext()

  const pathname = usePathname()
  // const locale = getCookie("NEXT_LOCALE");

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName: string) => {
    return pathname.includes(routeName);
  };

  const handleOnClick = () => {
    onClickRoute;
    setOpenSubMenu(false);
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
      if (
        route.layout === "/dashboard" ||
        route.layout === "/auth" ||
        route.layout === "/rtl"
      ) {
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
                href={route.path === `/academy` ? pathname : `${route.path}`}
                onClick={() => { route.path === "/academy" ? setOpenSubMenu(!openSubMenu) : handleOnClick(); }}
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
                  {(route.path === "/academy" && role !== "manager") ? "Academy" : route.name}
                </p>
                {!isCollapsedState && route.path === "/academy" && handleCollapseArrow(openSubMenu)}
              </Link>
              {route.hasChild &&
                <ul className={`${openSubMenu ? `block` : `hidden`}  py-2 space-y-2`}>
                  {route.children && route.children.map((child: any, index: number) => (

                    <li key={index}>
                      <Link
                        prefetch={child.name === "Courses" ? true : false}
                        href={`${route.path}${child.path}`}
                        className={`${isCollapsed ? `pl-[3rem]` : `pl-[4rem]`} flex items-center p-2 w-full text-base font-normal rounded-lg transition duration-75 group hover:bg-gray-100 dark:hover:bg-gray-700`}
                      >
                        <span
                          className={clsx(
                            activeRoute(`${route.path}${child.path}`) === true
                              ? "font-bold text-black dark:text-white"
                              : "font-medium text-gray-400",
                            (index === 0 && pathname !== `/academy/`) && "!text-gray-400"
                          )}
                        >
                          {child.icon ? child.icon : <DashIcon />}{" "}
                        </span>
                        <p
                          className={clsx(`leading-1`,
                            activeRoute(`${route.path}${child.path}`) === true ? "font-bold text-navy-600 dark:text-white" : "font-medium text-gray-600",
                            (index === 0 && pathname !== `/academy/`) && "!text-gray-600",
                            isCollapsed ? "hidden" : "flex ml-4"
                          )}
                        >
                          {child.name}
                        </p>

                      </Link>
                    </li>

                  ))}
                </ul>
              }
            </li>
            {activeRoute(route.path) ? (
              <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
            ) : null}
          </div>
        );
      }
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

export default SidebarLinks;
