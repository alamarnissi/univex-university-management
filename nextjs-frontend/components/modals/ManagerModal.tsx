'use client'
import ManagerLogin from '@/components/forms/manager-forms/ManagerLogin'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import ManagerForgetPassword from '../forms/manager-forms/ManagerForgetPassword'
import ManagerMissingFields from '../forms/manager-forms/ManagerMissingFields'
import ManagerRegister from '../forms/manager-forms/ManagerRegister'
import ManagerVerifyEmail from '../forms/manager-forms/ManagerVerifyEmail'
import ManagerResetPassword from '../forms/manager-forms/ManagerResetPassword'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import CheckSubdomainForm from '../forms/auth-forms/CheckSubdomainForm'

interface ManagerModalProps {
  subdomain?: string
  modalOpen: string,
  setModalOpen: (isOpen: string) => void
}

const ManagerModal = ({ subdomain, modalOpen, setModalOpen }: ManagerModalProps) => {
  return (
    <Transition show={modalOpen == "" ? false : true} as={Fragment} >
      <Dialog onClose={() => { setModalOpen("") }}>
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
            <Dialog.Panel className={cn(`relative w-full no-scrollbar rounded-3xl shadow-2xl aspect-auto bg-white overflow-hidden`,
              (modalOpen !== 'register' && modalOpen !== 'login') ? ' px-10 md:px-24 py-10 md:py-26' : null,
              modalOpen === 'register' ? '' : 'h-max'
            )}>

              <div className='text-center cursor-pointer p-1 absolute top-4 right-5 rounded-md bg-[#D9DADD] hover:bg-[#D9DADD]/80'>
                <X
                  size={16}
                  className='text-black'
                  onClick={() => { setModalOpen("") }}
                />
              </div>
              {
                {
                  "login": <ManagerLogin subdomain={subdomain} />,
                  "register": <ManagerRegister />,
                  "complete_register": <ManagerMissingFields />,
                  "forget_password": <ManagerForgetPassword />,
                  "reset_password": <ManagerResetPassword />,
                  "verify_email": <ManagerVerifyEmail />,
                  "check_subdomain": <CheckSubdomainForm />,
                }[modalOpen]
              }
            </Dialog.Panel>
          </div>
        </Transition.Child>
        {/* End: Modal dialog */}
      </Dialog>
    </Transition>

  )
}

export default ManagerModal