"use client"

import Link from "next/link";
import { FC, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import Card from "@/components/dashboard/card";
import { AiFillPlayCircle } from "react-icons/ai";
import { BsArrowUpRightSquare, BsThreeDotsVertical } from "react-icons/bs";
import FillStar from "@/components/Common/assets/FillStar";
import OutlineStar from "@/components/Common/assets/OutlineStar";
import { Progress } from "@/components/ui/progress";
import ConfirmActionPopup from "@/components/Common/ConfirmDeletePopup";
import Dropdown from "@/components/dashboard/dropdown";

type Props = {
  handleDelete: any
  handleChangeStatus: any
  isLoading: boolean
  course_id: string
  nbrModules?: string | number
  reviews?: number
  title?: string
  slug?: string
  author?: string
  profession?: string
  image?: string | StaticImageData
  status?: string
  progress?: number
  className?: string,
  role?: string
}

const CourseCard: FC<Props> = ({ handleDelete, handleChangeStatus, nbrModules, reviews, title, slug, image, status, progress, className, role }) => {
  const [openToolbar, setOpenToolbar] = useState(false);

  const reviewsScore = () => {
    if (reviews && reviews >= 0) return Number((reviews).toFixed())
    return 0;
  }

  const renderStars = () => {
    const stars = [];
    const score = reviewsScore();

    for (let i = 0; i < 5; i++) {
      if (i < score) {
        stars.push(<FillStar key={i} />);
      } else {
        stars.push(<OutlineStar key={i} />);
      }
    }

    return stars;
  };

  const handleDeleteCourse = async () => {
    await handleDelete({ course_slug: slug as string })
    setOpenToolbar(false)
  }

  const handleChangeCourseStatus = async () => {
    await handleChangeStatus({ course_slug: slug as string, course_status: status as string })
    setOpenToolbar(false)
  }

  return (
    <Card className={`flex flex-col w-full min-h-[340px] h-fit !pb-4 3xl:pb-![18px] bg-white shadow-xl ${className}`}
    >
      <div className="relative h-full w-full">
        {role === "manager" &&
          <div className="absolute right-1 px-1 pt-2 z-10">
            <Dropdown
              button={
                <button
                  className="absolute right-1 inline-block text-white dark:text-white dark:hover:text-black hover:text-black hover:bg-white rounded-lg text-sm px-[1px] py-1"
                  type="button"
                  onClick={() => setOpenToolbar(!openToolbar)}
                >
                  <span className="sr-only">Open dropdown</span>
                  <BsThreeDotsVertical size={26} />
                </button>
              }
              className="top-9 right-0"
            >
              {/*Dropdown menu*/}
              <div className={`z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow min-w-44 w-max dark:bg-white`}>
                <ul className="py-2">
                  <li className='text-center'>
                    {/* Delete button */}
                    <ConfirmActionPopup
                      key={slug}
                      icon={<BsArrowUpRightSquare size={20} />}
                      triggerTextColor="#DC2626"
                      triggerButtonMessage={status === "published" ? "Unpublish Course" : "Publish Course"}
                      alertHeading="Confirm Action !"
                      alertMessage={status === "published" ? "Are you sure you want to unpublish this course?" : "Are you sure you want to publish this course?"}
                      handleAction={() => handleChangeCourseStatus()}
                    />
                  </li>
                  <li className='text-center'>
                    {/* Delete button */}
                    <ConfirmActionPopup key={slug} triggerButtonMessage="Delete Course" handleAction={() => handleDeleteCourse()} />
                  </li>
                </ul>
              </div>
            </Dropdown>
          </div>
        }

        <Link
          prefetch={false}
          as={`/academy/courses/${slug}`}
          href={`/academy/courses/${slug}`}
          className="block relative w-full h-[168px]"
        >
          <Image
            src={image! as string}
            className="mb-3 rounded-t-xl"
            alt={title! as string}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            style={{ objectFit: "cover" }}
          />
        </Link>

        <div className="my-4 flex items-center justify-between px-4 flex-row">
          <div className="flex items-center justify-center gap-4">
            <AiFillPlayCircle size={24} />
            <p className="font-medium text-xs">{nbrModules} Modules</p>
          </div>
          <div className="flex items-center gap-1">
            {renderStars()}
          </div>
        </div>

        <div className="my-4 flex items-center justify-between px-4 md:flex-col md:items-start lg:flex-row lg:justify-between xl:flex-col xl:items-start 3xl:flex-row 3xl:justify-between">
          <div className="mb-2 h-[50px] overflow-hidden">
            <Link
              prefetch={false}
              href={`/academy/courses/${slug}`}
              className="font-bold text-navy-700 dark:text-white"
            >
              {" "}
              {title!.length > 55 ? `${title?.slice(0, 55)}...` : title}{" "}
            </Link>

          </div>
        </div>

        {role !== "student" ?
          <div className="flex flex-row justify-end items-center md:my-2 lg:mt-0 my-2 px-4">
            <div
              className={cn(`font-semibold text-sm capitalize leading-loose rounded-2xl py-1 px-3 h-9 w-max`,
                status === "published" && "bg-green-200-accent/20 text-green-400-accent dark:text-light-green-400-accent",
                status === "draft" && "bg-red-200/40 text-red-600 dark:text-red-400-accent",
                status === "in-review" && "bg-orange-200/40 text-orange-600 dark:text-orange-400-accent",
              )}
            >
              {status == "in-review" ? "In Review" : status}
            </div>
          </div>
          :
          <div className="flex flex-col justify-center gap-2 md:my-2 lg:mt-0 my-2 px-4">
            <p className="font-semibold text-sm text-[#37C0C8]">{progress}% Completed</p>
            <Progress value={progress} className="!bg-gray-100 h-2" style={{ backgroundColor: "#37C0C8" }} />
          </div>
        }


      </div>
    </Card>
  );
};

export default CourseCard;
