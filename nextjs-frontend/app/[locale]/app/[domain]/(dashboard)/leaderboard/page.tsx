import Image from "next/image"

import leaderBoard from "@/components/Common/assets/Leaderboard.png"
import userImg from "@/components/Common/assets/user.png"

const Leaderboardpage = () => {
    return (
        <>
            <div className="flex items-center justify-start gap-3">
                <Image
                    src={leaderBoard}
                    alt="leaderboard"
                    width={63}
                    height={63}
                />
                <p className="font-bold text-2xl py-2">
                    Leaderboard
                </p>
            </div>

            <div className="w-full flex items-center justify-center bg-white px-6 py-8 rounded-lg mt-5">


                <div className="w-full relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase border-b dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Student name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Rank
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Score
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="z-10 -mr-3 h-10 w-10 relative rounded-full border-2 border-white dark:!border-navy-800"
                                        >
                                            <Image
                                                className="h-full w-full rounded-full object-cover"
                                                src={userImg}
                                                alt="student"
                                                fill
                                            />
                                        </div>
                                        <div className="flex flex-col items-start gap-1 ml-1">
                                            <p className="text-sm font-semibold dark:text-white">
                                                {"Mike Torello"}{" "}
                                            </p>
                                        </div>
                                    </div>
                                </th>
                                <td className="px-6 py-4 text-gray-900 dark:text-white">
                                    1
                                </td>
                                <td className="px-6 py-4 text-gray-900 dark:text-white">
                                    2000 XP
                                </td>
                            </tr>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="z-10 -mr-3 h-10 w-10 relative rounded-full border-2 border-white dark:!border-navy-800"
                                        >
                                            <Image
                                                className="h-full w-full rounded-full object-cover"
                                                src={userImg}
                                                alt="student"
                                                fill
                                            />
                                        </div>
                                        <div className="flex flex-col items-start gap-1 ml-1">
                                            <p className="text-sm font-semibold dark:text-white">
                                                {"Tony Danza"}{" "}
                                            </p>
                                        </div>
                                    </div>
                                </th>
                                <td className="px-6 py-4 text-gray-900 dark:text-white">
                                    2
                                </td>
                                <td className="px-6 py-4 text-gray-900 dark:text-white">
                                    1900 XP
                                </td>
                            </tr>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="z-10 -mr-3 h-10 w-10 relative rounded-full border-2 border-white dark:!border-navy-800"
                                        >
                                            <Image
                                                className="h-full w-full rounded-full object-cover"
                                                src={userImg}
                                                alt="student"
                                                fill
                                            />
                                        </div>
                                        <div className="flex flex-col items-start gap-1 ml-1">
                                            <p className="text-sm font-semibold dark:text-white">
                                                {"Bonnie Bars"}{" "}
                                            </p>
                                        </div>
                                    </div>
                                </th>
                                <td className="px-6 py-4 text-gray-900 dark:text-white">
                                    3
                                </td>
                                <td className="px-6 py-4 text-gray-900 dark:text-white">
                                    1700 XP
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}

export default Leaderboardpage