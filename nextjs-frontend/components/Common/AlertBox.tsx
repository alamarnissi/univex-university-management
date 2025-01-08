import { AlertCircle, CheckIcon } from 'lucide-react'


const AlertBox = ({type, message, className}: {type: "success" | "error", message:string, className?: string}) => {
  return (
    <div className='w-full'>
        <div className={`${type === "success" ? "bg-green-100" : "bg-red-100"} ${className} alert flex items-stretch w-full mb-5 shadow-xl relative min-h-14 rounded-xl p-7`}>
            <div className='flex justify-center items-center px-3'>
                {type === "success" ? 
                    <CheckIcon
                        size={24}
                        className="text-green-500"
                    />
                    :
                    <AlertCircle
                        size={24}
                        className="text-red-500"
                    />
                }
            </div>
            <div className='flex justify-start itms-center max-w-fit px-3'>
                <p className={`${type === "success" ? 'text-green-500' : 'text-red-500'} font-medium text-center`}>
                    {message}
                </p>
            </div>
        </div>
    </div>
  )
}

export default AlertBox