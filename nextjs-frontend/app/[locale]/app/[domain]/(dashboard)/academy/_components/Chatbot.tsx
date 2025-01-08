"use client"
import { Button } from '@/components/ui/button';
import { Bot, Search, X } from 'lucide-react'
import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';

export const Chatbot = () => {
    const [open, setOpen] = React.useState(false);

    if (open) {
        return (
            <div className='shadow-lg overflow-hidden bg-slate-50 fixed cursor-pointer flex flex-col bottom-6 right-5 rounded-lg h-[400px] w-[340px]'>
                <div className='px-2 py-4 mb-4 flex items-center justify-between gap-3 border-b border-b-gray-200'>
                    <div className='w-full flex items-center justify-start gap-2'>
                        <div className='cursor-pointer flex items-center justify-center rounded-full bg-primary w-12 h-12'>
                            <Bot size={24} className="text-white -mt-1" />
                        </div>
                        <div>
                            <p className='font-semibold text-sm'>
                                Your AI assistant
                            </p>
                            <p className='text-gray-300 text-sm mt-1'>
                                Automated chat
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => { }}
                        className='w-10 text-center bg-slate-50 hover:bg-gray-100 p-0'
                    >
                        <BsThreeDotsVertical size={20} className='text-navy-700' />
                    </Button>
                    <Button
                        onClick={() => setOpen(false)}
                        className='w-10 text-center bg-slate-50 hover:bg-gray-100 p-0'
                    >
                        <X size={20} className='text-navy-700' />
                    </Button>
                </div>

                <div className='flex flex-col gap-2 w-full h-full px-2 py-3'>
                    <div className='w-fit text-sm text-center bg-white rounded-l-md rounded-r-xl px-4 py-3'>
                        Hi there
                    </div>
                    <div className='w-fit text-sm text-center bg-white rounded-l-md rounded-r-xl px-4 py-3'>
                        How can I help you today?
                    </div>

                    <div className='self-end w-fit text-sm text-center bg-primary text-white rounded-l-xl rounded-r-md px-4 py-3'>
                        Hello
                    </div>

                    <div className='w-fit text-sm text-center bg-white rounded-l-md rounded-r-xl px-4 py-3'>
                        oh, hi
                    </div>
                </div>

                <div className="relative w-full">
                    <input type="search" id="search-dropdown" className="block p-3 pl-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg rounded-s-gray-100 rounded-s-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Type your message" required />
                    <button type="submit" className="absolute top-0 end-0 p-3 h-full text-sm font-medium text-white bg-primary rounded-b-lg border border-primay hover:bg-primary/90 outline-none focus-visible:outline-none dark:bg-primary dark:hover:bg-primay/90">
                        <Search size={20} />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <Button
            onClick={() => setOpen(true)}
            className='fixed cursor-pointer flex items-center justify-center bottom-6 right-5 rounded-full bg-primary w-14 h-14'
        >
            <Bot size={26} className="text-white -mt-1" />
        </Button>
    )
}
