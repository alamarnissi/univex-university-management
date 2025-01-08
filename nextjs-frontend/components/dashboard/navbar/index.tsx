'use client'

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getPathWithSubdomain } from "@/lib/utils";

import Dropdown from "@/components/dashboard/dropdown";
import { useSidebarContext } from "@/components/providers/SidebarProvider";
import { useThemeContext } from "@/components/providers/ThemeProvider";
import { routes } from "@/lib/data/dashboardRoutes";

import { FiAlignJustify, FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";

// images
import UserImg from "@/components/Common/assets/user.png"
import { useManagerModalStore } from "@/stores/useManagerModalStore";

type Props = {
  userData: { username: string, role: string },
  params: { locale: string, domain: string }
}

const Navbar = ({ userData, params }: Props) => {

  const [currentRoute, setCurrentRoute] = useState("Dashboard");

  const router = useRouter();
  const pathname = usePathname()
  const { theme, setTheme } = useThemeContext()
  const { setOpenSidebar } = useSidebarContext()
  const { setModalOpenState } = useManagerModalStore();
  const authUserName = userData.username;
  const authUserRole = userData.role;


  useEffect(() => {
    getActiveRoute(routes);
  }, [pathname]);

  const getActiveRoute = (routes: any) => {
    // let activeRoute = "Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].path) !== -1) {
        setCurrentRoute((routes[i].name === "My Academy" && authUserRole !== "admin") ? "Academy" : routes[i].name);
      }
    }
    return currentRoute;
  };

  const handleLogOut = () => {

    // Construct the new URL by inserting the subdomain
    const newUrl = getPathWithSubdomain(params.domain);

    signOut({ redirect: false });
    deleteCookie("access_token");
    setModalOpenState("");

    router?.push(newUrl)

  }

  return (
    <nav className="sticky z-20 mt-4 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 mb-[20px] backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px] py-4">
        <p className="shrink text-[18px] capitalize text-navy-700 dark:text-white">
          <span className="font-bold capitalize hover:text-navy-700 dark:hover:text-white" >
            {`Hello ${authUserName ? authUserName : ""}`}
          </span>
        </p>
        <div className="h-6 w-[224px] pt-1">
          <span className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white">
            Welcome back to {currentRoute}
          </span>
        </div>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[420px] md:flex-grow-0 md:gap-1 xl:gap-2">
        <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          />
        </div>
        <span className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden" onClick={() => setOpenSidebar(true)} >
          <FiAlignJustify className="h-5 w-5" />
        </span>

        <div className="flex items-center justify-center gap-4">

          {/* start Notification */}
          {/* <Dropdown
          button={
            <p className="cursor-pointer">
              <IoMdNotificationsOutline className="h-4 w-4 text-gray-600 dark:text-white" />
            </p>
          }
          animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
          className={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
        >
          <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-navy-700 dark:text-white">
                Notification
              </p>
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                Mark all read
              </p>
            </div>

            <button className="flex w-full items-center">
              <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                <BsArrowBarUp />
              </div>
              <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                  New Update: Univex Dashboard PRO
                </p>
                <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                  A new update for your downloaded item is available!
                </p>
              </div>
            </button>

            <button className="flex w-full items-center">
              <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                <BsArrowBarUp />
              </div>
              <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                  New Update: Univex Dashboard PRO
                </p>
                <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                  A new update for your downloaded item is available!
                </p>
              </div>
            </button>
          </div>
        </Dropdown> */}

          {/* DARK MODE */}
          <div className="cursor-pointer text-gray-600"
            onClick={() => {
              theme === 'dark' ? setTheme('light') : setTheme('dark')
            }}
          >
            {theme === 'dark' ? (
              <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
            ) : (
              <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="hidden cursor-pointer md:flex flex-col items-center justify-center leading-[1.2]">
              <p className="shrink text-[14px] capitalize text-navy-700 dark:text-white w-max">
                <span className="font-bold capitalize hover:text-navy-700 dark:hover:text-white" >
                  {authUserName ? authUserName : ""}
                </span>
              </p>
              <div className="h-6">
                <span className="text-xs capitalize font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white" >
                  {authUserRole ? authUserRole : ""}
                </span>
              </div>
            </div>

            {/* Profile & Dropdown */}
            <Dropdown
              button={
                <Image
                  className="rounded-full cursor-pointer dark:contrast-0"
                  src={UserImg}
                  alt="Manager Image"
                  width={36}
                  height={36}
                />
              }
              className={"py-2 top-8 z-20 -left-[180px] w-max"}
            >
              <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                      👋 Hey, {authUserName ? authUserName : ""}
                    </p>{" "}
                  </div>
                </div>
                <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

                <div className="flex flex-col p-4">
                  <Link href={`/profile/settings`} className="text-sm text-gray-800 dark:text-white hover:dark:text-white" >
                    Profile Settings
                  </Link>
                  {/* <Link href=" " className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white" >
                    Newsletter Settings
                  </Link> */}
                  <button
                    className="mt-3 text-sm font-medium text-red-500 hover:text-red-500"
                    onClick={() => handleLogOut()} 
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </Dropdown>
          </div>
        </div>

      </div>

    </nav>
  );
};

export default Navbar;
