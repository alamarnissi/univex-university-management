'use client'

import { useState } from "react";
import Calendar from "react-calendar";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Card from "@/components/dashboard/card";

const MiniCalendar = ({classNames}: {classNames?: string}) => {
  const [value, onChange] = useState<any>(new Date());

  return (
    <div>
      <Card className={`flex w-full h-full flex-col px-3 py-3 ${classNames}`}>
        <Calendar
          onChange={onChange}
          value={value}
          defaultValue={new Date()}
          prevLabel={<MdChevronLeft className="ml-1 h-6 w-6 " />}
          nextLabel={<MdChevronRight className="ml-1 h-6 w-6 " />}
          view={"month"}
          className={"m-auto"}
        />
      </Card>
    </div>
  );
};

export default MiniCalendar;
