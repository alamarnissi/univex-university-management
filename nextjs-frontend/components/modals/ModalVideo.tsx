'use client'
import clsx from 'clsx'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useState, useRef, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import playbtnImg from "./play_btn.svg"

const ReactPlayer = dynamic(() => import('react-player/lazy'), {ssr: false})

interface ModalVideoProps {
  demoText: string,
  locale: string,
  video: string
  videoWidth: number | string
  videoHeight: number | string
}

export default function ModalVideo({
  demoText,
  locale,
  video,
  videoWidth,
  videoHeight,
}: ModalVideoProps) {

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <div>
      {/* Video thumbnail */}
      <button 
        className={clsx(
          "flex video-popup items-center gap-3 sm:gap-5",
          locale === "ar" && "flex-row-reverse"
        )}
        onClick={() => { setModalOpen(true) }}
        aria-label="Watch a demo"
        >
            <span className="w-[30px] animate-pulsing h-[30px] rounded-full grid place-items-center bg-[#bfb3f036] border-none">
            <Image src={playbtnImg} alt="play button" width={30} height={30}  />
            </span>
            <span className="text-interface-100 dark:text-gray-950 text-base font-semibold">{ demoText }</span>
        </button>
      {/* End: Video thumbnail */}
      <Transition show={modalOpen} as={Fragment} afterEnter={() => videoRef.current?.play()}>
        <Dialog initialFocus={videoRef} onClose={() => setModalOpen(false)}>
          {/* Modal backdrop */}
          <Transition.Child
            className="fixed inset-0 z-[999] bg-black opacity-50 transition-opacity"
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-out duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            aria-hidden="true"
          />
          {/* End: Modal backdrop */}
          {/* Modal dialog */}
          <Transition.Child
            className="fixed inset-0 z-[9999] flex p-6"
            enter="transition ease-out duration-300"
            enterFrom="opacity-0 scale-75"
            enterTo="opacity-100 scale-100"
            leave="transition ease-out duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-75"
          >
            <div className="max-w-5xl mx-auto h-full flex items-center">
              <Dialog.Panel className="relative md:w-[1280px] w-full max-h-full rounded-3xl shadow-2xl aspect-video bg-black overflow-hidden">
                <ReactPlayer 
                  url={video} 
                  width={videoWidth} 
                  height={videoHeight} 
                  loop 
                  controls 
                  />
              </Dialog.Panel>
            </div>
          </Transition.Child>
          {/* End: Modal dialog */}
        </Dialog>
      </Transition>
    </div>
  )
}