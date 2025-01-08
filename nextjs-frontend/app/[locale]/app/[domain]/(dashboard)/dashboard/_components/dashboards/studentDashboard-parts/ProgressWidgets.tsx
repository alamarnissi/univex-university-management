import Widget from '@/components/dashboard/widget'
import { CheckCircle, RefreshCcwDot } from 'lucide-react'
import { BsBookmarkCheck } from 'react-icons/bs'

export const ProgressWidgets = () => {
    return (
        <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
            <Widget
                icon={<CheckCircle className="h-7 w-7 text-[#85C633]" />}
                title={"Courses Completed"}
                value={"03"}
            />
            <Widget
                icon={<RefreshCcwDot className="h-6 w-6 text-[#D9186C]" />}
                title={"Courses in Progress"}
                value={"05"}
            />
            <Widget
                icon={<BsBookmarkCheck className="h-7 w-7 text-[#EAA451]" />}
                title={"Quizes Completed"}
                value={"16"}
            />
        </div>
    )
}
