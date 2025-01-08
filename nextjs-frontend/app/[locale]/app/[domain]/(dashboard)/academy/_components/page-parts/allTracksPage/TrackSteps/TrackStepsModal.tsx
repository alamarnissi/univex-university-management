"use client"
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

import { X } from 'lucide-react'
import Processing from './Processing'
import StepOne from './StepOne'
import StepTwo from './StepTwo'

interface StepsModalProps {
  modalOpen: boolean,
  currentStep: number,
  setModalOpen: (value: boolean) => void,
  setCurrentStep: (value: number) => void
}

const TracksStepsModal = ({ modalOpen, currentStep, setModalOpen, setCurrentStep }: StepsModalProps) => {

  const setOnClose = () => {
    setModalOpen(false);
    setCurrentStep(1);
  }

  return (
    <Transition show={modalOpen} as={Fragment} >
      <Dialog as='div' onClose={() => { }}>
        {/* Modal backdrop */}
        <Transition.Child
          className="fixed inset-0 z-[99] bg-black opacity-50 transition-opacity"
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
          className="fixed inset-0 z-[999] flex p-0 md:p-6"
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-75"
          enterTo="opacity-100 scale-100"
          leave="transition ease-out duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <div className="max-w-5xl mx-auto h-full flex items-center w-full md:w-auto px-5 md:px-0">
            <Dialog.Panel className={`${currentStep != 4 ? `h-[600px] md:h-max` : `h-max`} relative w-full overflow-y-scroll no-scrollbar rounded-3xl shadow-2xl aspect-auto bg-[#F4F7FE] overflow-hidden px-10 pt-5 pb-8`}>
              {currentStep != 3 &&
                <Dialog.Title
                  as="h3"
                  className={"leading-loose font-semibold text-xl text-center pb-3 dark:text-black"}
                >
                  New Track Setup
                </Dialog.Title>
              }
              <div className='text-center cursor-pointer p-1 absolute top-4 right-5 rounded-md bg-[#D9DADD] hover:bg-[#D9DADD]/80'>
                <X
                  size={16}
                  className='text-black'
                  onClick={() => { setOnClose() }}
                />
              </div>
              {
                {
                  1: <StepOne />,
                  2: <StepTwo />,
                  3: <Processing />,
                }[currentStep]
              }
            </Dialog.Panel>
          </div>
        </Transition.Child>
        {/* End: Modal dialog */}
      </Dialog>
    </Transition>
  )

}

export default TracksStepsModal;