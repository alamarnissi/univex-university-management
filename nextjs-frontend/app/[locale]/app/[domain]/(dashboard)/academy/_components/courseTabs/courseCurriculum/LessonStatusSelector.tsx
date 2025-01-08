import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react";

type StatusSelectorProps = {
    lesson_id: string, 
    lesson_status: string, 
    handleStatusChange: any
}

const LessonStatusSelector = ({lesson_id, lesson_status, handleStatusChange}: StatusSelectorProps) => {
    const [selectedItem, setSelectedItem] = useState(lesson_status);
    
    return (
        <Select 
            onValueChange={async (val) => {
                setSelectedItem(val);
                await handleStatusChange(lesson_id, {lesson_status: val});
                return;
            }} 
            defaultValue="draft"
            value={selectedItem}
        >
            <SelectTrigger className={`${selectedItem === "draft" ? "border-[#EE5D50] text-[#EE5D50]" : "border-[#13C296] text-[#13C296]"} border w-[110px] px-2 text-sm text-center font-semibold focus:ring-0`}>
                <SelectValue placeholder="Draft" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default LessonStatusSelector