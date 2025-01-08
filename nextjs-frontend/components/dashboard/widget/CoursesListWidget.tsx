"use client"
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/components/dashboard/card";

// images
import courseImg from "@/components/Common/assets/singleCourse/course.jpg";
import FillStar from "@/components/Common/assets/FillStar";
import OutlineStar from "@/components/Common/assets/OutlineStar";
import { StudentsIcon } from "@/components/Common/assets/sidebarIcons";

type ListWidgetProps = {
  coursesData: any
  widgetTitle?: string
  imgHeight?: number
  imgWidth?: number
  isRatioAuto?: boolean
}

const CoursesListWidget = ({ coursesData, widgetTitle = "Most Popular courses", imgHeight, imgWidth, isRatioAuto }: ListWidgetProps) => {

  const reviewsScore = (reviews: number) => {
    if (reviews && reviews >= 0) return Number((reviews).toFixed())
    return 0;
  }

  const renderStars = (reviews: number) => {
    const stars = [];
    const score = reviewsScore(reviews);

    for (let i = 0; i < 5; i++) {
      if (i < score) {
        stars.push(<FillStar key={i} />);
      } else {
        stars.push(<OutlineStar key={i} />);
      }
    }

    return stars;
  };

  return (
    <Card className={"mt-3 !z-5 overflow-hidden "}>
      {/* CoursesListWidget Header */}
      <div className="flex items-center justify-between rounded-t-3xl p-3">
        <div className="font-bold text-navy-700 dark:text-white">
          {widgetTitle}
        </div>
        <button className="linear bg-transparent px-4 py-2 font-medium text-sm underline text-primary transition duration-200 hover:bg-transparent hover:text-primary/80 active:bg-transparent dark:bg-transparent dark:text-primary dark:hover:bg-primary/10 dark:active:bg-primary/20">
          View All
        </button>
      </div>

      {/* History CardData */}
      {coursesData && coursesData?.length > 0 ? coursesData.map((data: any) => {
        return (
          <Link
            key={data.slug}
            prefetch={false}
            href={`/academy/courses/${data.slug}`}
            className="cursor-pointer flex h-full w-full items-center justify-between bg-white px-3 py-[10px] hover:shadow-2xl hover:bg-gray-50 dark:!bg-navy-800 dark:shadow-none dark:hover:!bg-navy-700"
          >
            <div className="flex items-center gap-3 w-full">
              <div className={cn(`relative flex items-center justify-center`)}>
                <Image
                  className={cn("rounded-lg", isRatioAuto ? "aspect-auto" : "aspect-square")}
                  src={data?.promotional_image ? `${process.env.NEXT_PUBLIC_GCS_URL}${process.env.NEXT_PUBLIC_GCS_BUCKET_NAME}/${data?.promotional_image}` : courseImg}
                  alt="course image"
                  height={imgHeight || 85}
                  width={imgWidth || 85}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="flex flex-col h-full space-y-3 w-full">
                <h5 className="text-sm font-bold text-navy-700 dark:text-white">
                  {" "}
                  {data.course_name}
                </h5>
                <div className="flex items-center justify-between font-normal text-gray-600 dark:text-white">
                  <p className="flex space-x-2 mt-1 text-[13px] font-semibold text-gray-700">
                    {" "}
                    <StudentsIcon /> <span>{data.number_of_students}{" Learners"}</span>
                  </p>
                  <div className="flex items-center gap-1">
                    {renderStars(data.overall_rating)}
                  </div>
                </div>
              </div>
            </div>


          </Link>
        )
      })
      : 
      <div className="flex h-full w-full items-center justify-center bg-white px-3 py-[20px] hover:shadow-2xl hover:bg-gray-50 dark:!bg-navy-800 dark:shadow-none dark:hover:!bg-navy-700">
        <h5 className="text-sm font-bold text-red-500 dark:text-white">
          {" "}
          No courses found
        </h5>
      </div>
    }
    </Card>
  );
};

export default CoursesListWidget;
