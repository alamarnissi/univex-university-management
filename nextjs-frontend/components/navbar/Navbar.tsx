"use client";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import menuData from "./menuData";
import styles from "@/lib/styles"
import {
  useManagerModalStore
} from "@/stores/useManagerModalStore";
import LocaleSwitcher from "../Common/LocaleSwitcher";
import { useTranslations } from 'next-intl';

import logo from "./logo.png"

const ManagerModal = dynamic(() => import("../modals/ManagerModal"))

const Navbar = ({ locale }: { locale: string }) => {
  const t = useTranslations('LandingPage');
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // Modal Toggle
  const {
    modalOpenState,
    setModalOpenState,
  } = useManagerModalStore();

  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: any) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const setParamQuery = ({ name, type }: { name?: string, type: "add" | "delete" }) => {
    const current = new URLSearchParams(Array.from(params.entries()));

    if (type == "add" && name) {
      current.delete("modalopen");
      setModalOpenState(name)
      current.set("modalopen", name);
    } else {
      setModalOpenState("");
      current.delete("modalopen");
    }

    // cast to string
    const search = current.toString();
    const query = search ? `?${search}` : "";

    router?.push(`${pathname}${query}`);
  }

  const checkParamQuery = () => {
    return params.get("modalopen") as string;
  }

  useEffect(() => {
    switch (modalOpenState) {
      case "check_subdomain":
        setParamQuery({ name: "check_subdomain", type: "add" })
        break;
      case "register":
        setParamQuery({ name: "register", type: "add" })
        break;
      case "complete_register":
        setParamQuery({ name: "complete_register", type: "add" })
        break;
      case "forget_password":
        setParamQuery({ name: "forget_password", type: "add" })
        break;
      case "reset_password":
        setParamQuery({ name: "reset_password", type: "add" })
        break;
      case "verify_email":
        setParamQuery({ name: "verify_email", type: "add" })
        break;
      default:
        setParamQuery({ name: "", type: "delete" })
        break;
    }
  }, [modalOpenState]);

  useEffect(() => {
    const modalQuery = checkParamQuery();
    if (modalQuery) {
      setModalOpenState(modalQuery);
    }
  }, [])


  return (
    <>
      <header
        className={`${styles.paddingX} ${styles.flexCenter} header top-0 z-40 flex w-full items-center bg-transparent ${sticky
            ? "!fixed !z-[99] left-0 !bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm !transition"
            : "absolute"
          }`}
      >
        <div className={`w-full mx-auto ${styles.boxWidth} ${sticky ? "px-0 md:px-5" : ""
          }`}>
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="flex w-full items-center justify-between px-4">
              <div className="max-w-full pr-4 xl:mr-12">
                <Link
                  href="/"
                  onClick={() => { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }}
                  className={`header-logo w-full flex gap-3 ${sticky ? "py-5 lg:py-2" : "py-8"
                    } `}
                >
                  <button className="p-2 rounded-full bg-[#F2EFFC] w-10 h-10 flex items-center justify-center">
                    <Image
                      src={logo}
                      alt="logo"
                      width={18}
                      height={18}
                    />
                  </button>
                  <p className="text-2xl font-bold leading-10 dark:text-gray-950">
                    Univex
                  </p>
                </Link>
              </div>
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? " top-[7px] rotate-45" : " "
                      }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? "opacity-0 " : " "
                      }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? " top-[-8px] -rotate-45" : " "
                      }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white py-4 px-6 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                    }`}
                >
                  <ul className="block lg:flex gap-8 xl:gap-10">
                    {menuData.map((menuItem, index) => (
                      <li key={menuItem.id} className="group relative">
                        {menuItem.path ? (
                          <a
                            href={menuItem.path}
                            className={`flex py-2 lg:w-max text-base text-dark dark:text-gray-950 font-semibold group-hover:opacity-70 lg:mr-0 lg:inline-flex lg:py-6 lg:px-0`}
                          >
                            {t(menuItem.title)}
                          </a>
                        ) : (
                          <>
                            <a
                              onClick={() => handleSubmenu(index)}
                              className="flex cursor-pointer items-center justify-between py-2 text-base text-dark group-hover:opacity-70 dark:text-white lg:mr-0 lg:inline-flex lg:py-6 lg:px-0"
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg width="15" height="14" viewBox="0 0 15 14">
                                  <path
                                    d="M7.81602 9.97495C7.68477 9.97495 7.57539 9.9312 7.46602 9.8437L2.43477 4.89995C2.23789 4.70308 2.23789 4.39683 2.43477 4.19995C2.63164 4.00308 2.93789 4.00308 3.13477 4.19995L7.81602 8.77183L12.4973 4.1562C12.6941 3.95933 13.0004 3.95933 13.1973 4.1562C13.3941 4.35308 13.3941 4.65933 13.1973 4.8562L8.16601 9.79995C8.05664 9.90933 7.94727 9.97495 7.81602 9.97495Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </a>
                          </>
                        )}
                      </li>
                    ))}
                    <div className="w-full mt-3 md:hidden">
                      <button
                        onClick={() => {
                          setModalOpenState("check_subdomain");
                        }}
                        className="flex-auto py-3 px-4 mr-3 text-base font-semibold text-primary hover:opacity-70 dark:text-parimary md:hidden"
                      >
                        {t("links.login")}
                      </button>
                      <button
                        onClick={() => {
                          setModalOpenState("register");
                        }}
                        className="ease-in-up text-center flex-auto rounded-md bg-primary py-3 px-4 mb-3 text-base font-bold text-white transition duration-300 hover:opacity-90 hover:shadow-signUp md:hidden md:px-9 lg:px-6 xl:px-9"
                      >
                        {t("links.register")}
                      </button>
                      <LocaleSwitcher />
                    </div>
                  </ul>
                </nav>
              </div>
              <div className="hidden md:flex gap-7 items-center justify-end pr-16 lg:pr-0">
                <button
                  onClick={() => {
                    setModalOpenState("check_subdomain");
                  }}
                  className={`${locale === "ar" ? `pr-7` : `pl-7`} py-3 text-base font-semibold text-primary hover:opacity-70 dark:text-primary`}
                >
                  {t("links.login")}
                </button>
                <button
                  onClick={() => {
                    setModalOpenState("register");
                  }}
                  className="ease-in-up rounded-md bg-primary py-3 px-8 text-base font-bold text-white transition duration-300 hover:opacity-90 hover:shadow-signUp md:px-9 lg:px-6 xl:px-9"
                >
                  {t("links.register")}
                </button>
                <LocaleSwitcher />
              </div>
            </div>
          </div>
        </div>
      </header>
      <>
        {modalOpenState !== "" && <ManagerModal modalOpen={modalOpenState} setModalOpen={setModalOpenState} />}
      </>
    </>
  );
};

export default Navbar;
