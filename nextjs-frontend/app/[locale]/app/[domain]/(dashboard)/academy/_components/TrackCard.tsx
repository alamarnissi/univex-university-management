"use client"
import Card from '@/components/dashboard/card'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'

type Props = {
    title: string,
    date: string,
    image?: string | StaticImageData 
}

const TrackCard: FC<Props> = ({title, date, image}) => {
  return (
    <Card className={`flex flex-col w-full min-h-[280px] h-fit !pb-4 3xl:pb-![18px] bg-white`}
    >
      <div className="h-full w-full">
        <Link 
          as={`#`} 
          href={`#`} 
          className="block relative w-full h-[168px]"
        >
          <Image
            src={image! as string}
            className="mb-3 h-full w-full rounded-t-xl 3xl:h-full 3xl:w-full"
            alt={title! as string}
            fill
          />
        </Link>

        <div className="my-4 flex items-center justify-between px-4 md:flex-col md:items-start lg:flex-row lg:justify-between xl:flex-col xl:items-start 3xl:flex-row 3xl:justify-between">
          <div className="mb-2">
            <Link 
              href={`#`} 
              className="text-lg font-bold text-navy-700 dark:text-white"
            >
              {" "}
              {title}{" "}
            </Link>

          </div>
        </div>

        <div className="flex flex-row justify-end items-center md:my-2 lg:mt-0 my-2 px-4">

          <p className={`text-gray-600 font-semibold text-sm leading-loose py-1 px-3 h-9 w-max`}>{date}</p>
        </div>
        <div className='flex w-full items-center justify-center'>
            <button className='border border-gray-600 rounded-3xl text-center text-sm text-gray-700 font-semibold py-2 px-7 hover:text-gray-700/80'>
                View Details
            </button>
        </div>
      </div>
    </Card>
  )
}

export default TrackCard