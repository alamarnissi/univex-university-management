import { X } from 'lucide-react'
import { PenLine } from 'lucide-react'

export const NoteCard = ({ bgColor }: { bgColor?: string }) => {
    return (
        <div className={`${bgColor ? bgColor : 'bg-green-400/80'} relative flex flex-col gap-4 justify-center rounded-xl px-5 py-5`}>
            <X size={20} className="hover:cursor-pointer text-black absolute top-3 right-3" />
            <p className='font-semibold'>Python Resmue</p>
            <p className='text-sm'>
                Python est langage de programmation interprété, multiparadigme et multiplateformes. Il favorise la programmation impérative structurée
            </p>
            <p className='text-sm text-navy-700'>22/06/2022</p>
            <div className='hover:cursor-pointer absolute bottom-2 right-2 flex items-center justify-center p-3 bg-black rounded-full'>
                <PenLine size={20} className="text-white" />
            </div>
        </div>
    )
}
