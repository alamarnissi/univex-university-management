"use client"
import { useModalStore } from '@/stores/useModalsStore'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { Fragment } from 'react'


const AddStudentModal = () => {
  const { modalOpenState, setModalOpenState } = useModalStore();
  return (
    <Transition show={modalOpenState} as={Fragment} >
      <Dialog as='div' onClose={() => { setModalOpenState(false) }}>
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
            <Dialog.Panel className={`relative h-max w-[400px] overflow-y-scroll no-scrollbar rounded-3xl shadow-2xl aspect-auto bg-[#F4F7FE] overflow-hidden px-10 pt-5 pb-8`}>
              <Dialog.Title
                as="h3"
                className={"font-semibold text-xl text-center pb-3 dark:text-black"}
              >
                Add a student to your workspace
              </Dialog.Title>

              <div className='text-center cursor-pointer p-1 absolute top-4 right-5 rounded-md bg-[#D9DADD] hover:bg-[#D9DADD]/80'>
                <X
                  size={16}
                  className='text-black'
                  onClick={() => { setModalOpenState(false) }}
                />
              </div>
              {
                <div className='pt-8 pb-2 px-3 flex flex-col justify-center gap-4'>
                  <div className='self-stretch pr-0 md:pr-5 leading'>
                    <label htmlFor="name" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                      Student Name
                    </label>
                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Oussama Bahri" required />
                  </div>
                  <div className='self-stretch pr-0 md:pr-5 leading'>
                    <label htmlFor="name" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                      Adresse Email
                    </label>
                    <input type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="oussama.bahri@gmail.com" required />
                  </div>
                  <div className='mt-4'>
                    <div className='flex items-center justify-start md:justify-end mt-7 md:mt-0'>
                      <button
                        type="submit"
                        className="text-white inline-flex items-center bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              }
            </Dialog.Panel>
          </div>
        </Transition.Child>
        {/* End: Modal dialog */}
      </Dialog>
    </Transition>
  )
}

export default AddStudentModal