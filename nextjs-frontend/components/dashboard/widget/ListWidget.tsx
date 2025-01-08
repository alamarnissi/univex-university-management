import Card from "@/components/dashboard/card";
import Image from "next/image";
import { AiOutlineClockCircle } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";

// images
import img1 from "./assets/img1.jpg"
import img2 from "./assets/img2.jpg"
import img3 from "./assets/img3.jpg"

type ListWidgetProps = {
  widgetTitle?: string
  showProgressBar?: boolean
  showDateInfo?: boolean
  imgHeight?: number
  imgWidth?: number
  isRatioAuto?: boolean
}

const ListWidget = ({ widgetTitle = "Recent Courses", showProgressBar = false, showDateInfo = true, imgHeight, imgWidth, isRatioAuto }: ListWidgetProps) => {
  const CoursesData = [
    {
      image: img1,
      title: "UX/UI Design Formation Course",
      owner: "Thomas Magum",
      time: "5h 32m",
      progress: 30
    },
    {
      image: img2,
      title: "Front-end Developpement",
      owner: "B.A. Baracus",
      time: "2h 15m",
      progress: 70
    },
    {
      image: img3,
      title: "UX/UI Design Formation Course",
      owner: "Dori Doreau",
      time: "5h 32m",
      progress: 15
    },
  ];

  return (
    <Card className={"mt-3 !z-5 overflow-hidden "}>
      {/* ListWidget Header */}
      <div className="flex items-center justify-between rounded-t-3xl p-3">
        <div className="text-lg font-bold text-navy-700 dark:text-white">
          {widgetTitle}
        </div>
        <button className="linear bg-transparent px-4 py-2 font-medium text-sm underline text-primary transition duration-200 hover:bg-transparent hover:text-primary/80 active:bg-transparent dark:bg-transparent dark:text-primary dark:hover:bg-primary/10 dark:active:bg-primary/20">
          View All
        </button>
      </div>

      {/* History CardData */}
      {CoursesData.map((data, index) => (
        <div className="flex h-full w-full items-start justify-between bg-white px-3 py-[20px] hover:shadow-2xl dark:!bg-navy-800 dark:shadow-none dark:hover:!bg-navy-700" key={index}>
          <div className="flex items-center gap-3 w-full">
            <div className={cn(`relative flex items-center justify-center`)}>
              <Image
                className={cn("rounded-lg", isRatioAuto ? "aspect-auto" : "aspect-square")}
                src={data.image}
                alt=""
                height={imgHeight || 85}
                width={imgWidth || 85}
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="flex flex-col w-full">
              <h5 className="text-sm font-bold text-navy-700 dark:text-white">
                {" "}
                {data.title}
              </h5>
              {showDateInfo && (
                <>
                  <div className="flex items-center text-xs font-normal text-gray-600 dark:text-white">
                    <AiOutlineClockCircle color="orange" className="mr-2" />
                    <p>{data.time}</p>
                  </div>
                  <p className="mt-1 text-xs font-normal text-gray-600">
                    {" "}
                    {data.owner}{" "}
                  </p>
                </>
              )}
              {showProgressBar && (
                <div className="w-full flex flex-col gap-4 justify-center mt-3">
                  <Progress value={data.progress} className="h-1 bg-gray-100" />
                  <div className="flex items-center justify-end">
                    <Button
                      variant={"outline"}
                      className="flex items-center justify-center gap-2 rounded-full border-primary text-sm text-primary/90 hover:text-primary hover:bg-white"
                    >
                      keep making progress
                      <ChevronRightIcon size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>


        </div>
      ))}
    </Card>
  );
};

export default ListWidget;
