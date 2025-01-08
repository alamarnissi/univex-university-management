import { FC, ReactNode } from "react";
import Card from "@/components/dashboard/card";

type Props = {
  icon?: ReactNode | string
  iconBg?: string
  title?: string
  value?: string
  valDiff?: string
  diffIsPositive?: boolean
}

const Widget: FC<Props> = ({ icon, iconBg, title, value, valDiff, diffIsPositive }) => {
  return (
    <Card className="!flex-row flex-grow items-center justify-between rounded-[10px] min-h-[90px] py-4">
      <div className="h-50 ml-4 flex w-auto flex-col justify-start space-y-2">
        <p className="text-[15px] font-semibold text-gray-700">{title}</p>
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {value}
        </h4>
        {valDiff && <p className="font-dm text-sm font-medium text-gray-600"><span className={`${diffIsPositive ? 'text-green-500' : 'text-red-500'}`}>{valDiff}</span> Vs prev month</p>}
        
      </div>
      <div className="mr-3 flex h-full w-auto flex-row items-start justify-start">
        <div className={`${iconBg ? iconBg : 'bg-lightPrimary'} rounded-lg p-2 dark:bg-navy-700`}>
          <span className="flex items-center text-primary dark:text-white">
            {icon}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default Widget;
