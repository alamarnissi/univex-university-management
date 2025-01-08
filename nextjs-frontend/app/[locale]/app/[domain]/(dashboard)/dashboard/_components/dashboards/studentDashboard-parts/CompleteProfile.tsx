import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronRightIcon } from 'lucide-react'

export const CompleteProfile = () => {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-24 mb-5 bg-white rounded-lg h-fit lg:h-[100px] mx-auto py-5 lg:py-0 px-5 lg:px-10">
            <div className="w-full lg:w-3/4 ">
                <div className="flex items-center justify-between text-[#EAA451] font-semibold mb-2">
                    <p >Profile</p>
                    <p >30%</p>
                </div>
                <Progress value={30} className="h-2 bg-gray-100" />
            </div>
            <div className="w-full lg:w-1/4">
                <Button
                    variant={"outline"}
                    className="flex items-center justify-center gap-2 rounded-full border-primary text-primary/90 hover:text-primary hover:bg-white"
                >
                    Complete Profile
                    <ChevronRightIcon size={16} />
                </Button>
            </div>
        </div>
    )
}
