import { DiscordIcon } from '@/components/Common/assets/socialIcons/DiscordIcon'
import { FbIcon } from '@/components/Common/assets/socialIcons/FbIcon'
import { LinkedinIcon } from '@/components/Common/assets/socialIcons/LinkedinIcon'
import Image from 'next/image'

// images
import UserImg from "@/components/Common/assets/user.png"

export const UserInfoCard = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white px-4 py-8">
            <Image src={UserImg} alt="User Image" className="rounded-full" width={60} height={60} />
            <div className="text-center">
                <p className="capitalize text-lg font-bold text-navy-700 dark:text-white">
                    Oussama Bahri
                </p>
                <p className="text-sm font-normal text-gray-600">
                    oussama.bahri@gmail.com
                </p>
            </div>
            <div className="flex items-center justify-center gap-5 mt-3">
                <FbIcon />
                <LinkedinIcon />
                <DiscordIcon />
            </div>
        </div>
    )
}
