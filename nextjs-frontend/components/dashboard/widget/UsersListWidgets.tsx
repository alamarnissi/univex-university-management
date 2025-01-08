import Card from "@/components/dashboard/card";
import Image from "next/image";
import { cn } from "@/lib/utils";


type UsersDataProps = {
    image: any
    name: string
    xp: string
}
type UsersListWidgetProps = {
    usersData: UsersDataProps[]
    widgetTitle?: string
    showProgressBar?: boolean
    showDateInfo?: boolean
    imgHeight?: number
    imgWidth?: number
    isRatioAuto?: boolean
}



const UsersListWidget = ({ usersData, widgetTitle = "Top active learners", showProgressBar = false, showDateInfo = true, imgHeight, imgWidth, isRatioAuto }: UsersListWidgetProps) => {

    return (
        <Card className={"mt-3 !z-5 overflow-hidden "}>
            {/* UsersListWidget Header */}
            <div className="flex items-center justify-between rounded-t-3xl p-3">
                <div className="font-bold text-navy-700 dark:text-white flex items-center gap-1 flex-wrap">
                    {widgetTitle} <span className="text-gray-400 text-[13px] font-normal">{`(Last 30 days)`}</span>
                </div>
                <button className="min-w-fit linear bg-transparent px-4 py-2 font-medium text-sm underline text-primary transition duration-200 hover:bg-transparent hover:text-primary/80 active:bg-transparent dark:bg-transparent dark:text-primary dark:hover:bg-primary/10 dark:active:bg-primary/20">
                    View All
                </button>
            </div>

            {/* History CardData */}
            {usersData && usersData?.length > 0 ? usersData.map((data, index) => (
                <div key={index} className="cursor-pointer flex h-full w-full items-center justify-between bg-white px-3 py-[10px] hover:shadow-2xl hover:bg-gray-50 dark:!bg-navy-800 dark:shadow-none dark:hover:!bg-navy-700" >
                    <div className="flex items-center gap-3 w-full">
                        <div className={cn(`relative flex items-center justify-center`)}>
                            <Image
                                className={cn("rounded-full", isRatioAuto ? "aspect-auto" : "aspect-square")}
                                src={data.image}
                                alt=""
                                height={imgHeight || 50}
                                width={imgWidth || 50}
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                        <div className="w-full flex items-center justify-start">
                            <h5 className="text-sm font-bold text-navy-700 dark:text-white">
                                {" "}
                                {data.name}
                            </h5>
                        </div>
                        <div className="min-w-max flex items-center justify-center">
                            <p className="text-sm font-bold text-primary dark:text-primary">
                                {" "}
                                {data.xp}
                            </p>
                        </div>
                    </div>


                </div>
            ))
                :
                <div className="flex h-full w-full items-center justify-center bg-white px-3 py-[20px] hover:shadow-2xl hover:bg-gray-50 dark:!bg-navy-800 dark:shadow-none dark:hover:!bg-navy-700">
                    <h5 className="text-sm font-bold text-red-500 dark:text-white">
                        {" "}
                        No learners found
                    </h5>
                </div>
            }
        </Card>
    );
};

export default UsersListWidget;
