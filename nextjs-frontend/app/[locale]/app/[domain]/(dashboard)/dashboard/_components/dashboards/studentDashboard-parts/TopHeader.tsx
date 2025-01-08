import { XpIcon } from "@/components/Common/assets/XpIcon"

export const TopHeader = () => {
    return (
        <div className="flex items-center justify-start gap-3 py-3 mb-5">
            <XpIcon />
            <p className="text-lg font-semibold">Daily Score</p>
            <div className="inline-block px-2 font-semibold text-[#D9186C] border border-[#D9186C] py-3 ml-2">
                0 XP
            </div>
        </div>
    )
}
