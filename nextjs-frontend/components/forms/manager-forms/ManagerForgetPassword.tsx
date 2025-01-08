"use client"

import AlertBox from '@/components/Common/AlertBox';
import { useToast } from '@/components/ui/toast/use-toast';
import { FetchForgetPassword } from '@/lib/fetch/Auth';
import { useManagerModalStore } from '@/stores/useManagerModalStore';
import { Globe } from 'lucide-react';
import { MailIcon } from 'lucide-react';
import { useState } from 'react';

/**
 * This will verify valid email and send an email to reset password
 * @returns 
 */
const ManagerForgetPassword = () => {
    const { toast } = useToast();
    const { setModalOpenState } = useManagerModalStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); // check if form submitted successfully

    const [formValue, setFormValue] = useState({
        subdomain: "",
        email: ""
    });

    const {subdomain, email} = formValue;

    const flexCenter = "flex flex-col justify-center items-center gap-4";

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, data: { subdomain: string, email: string }) => {
        event.preventDefault();

        setIsSuccess(false);
        setIsLoading(true);
        
        try {
            const response = await FetchForgetPassword(data, "manager");
            
            if (response) {
                if (response.status === 404) {
                    toast({ variant: "destructive", description: "Please Enter Valid Email or Subdomain" });
                } else if (response.status >= 200 && response.status < 300) {
                    setIsSuccess(true);
                    toast({ variant: "success", description: "Check Your Email To Reset Your Password" });
                } else {
                    toast({ variant: "destructive", description: "Something went wrong" });
                }
                setIsLoading(false);
            }
        } catch (err) {
            setIsLoading(false); // Stop loading in case of error
            toast({ variant: "destructive", description: "An Error Has Occurred" });
            console.error(err);
        }
    }

    return (
        <div className={`${flexCenter} sm:min-w-[300px] md:min-w-[400px]`}>

            {isSuccess ?
                <AlertBox type='success' message='Please check your email inbox for a link to complete the reset.' className='mt-5' /> :
                <>
                    <div className={`${flexCenter} mb-5 md:mb-7.5 max-w-[400px]`}>
                        <p className='text-center text-lg md:text-2xl font-medium leading-[20px] md:leading-[29px] dark:text-black'>Reset your password</p>
                        <p className='text-center font-medium font-base text-[#00000050]'>To reset your password, enter your email below and submit. An email will be sent to you with instructions about how to complete the process.</p>
                    </div>
                    <form
                        className='w-full'
                        onSubmit={(e) => handleSubmit(e, formValue)}
                    >
                        <div className="flex-1 flex flex-wrap items-stretch border border-[#0B465440] w-full mb-5 relative h-14 bg-white rounded-lg">
                            <div className="flex -mr-px justify-center w-15 py-4 pl-2">
                                <div
                                    className="flex items-center leading-normal bg-white px-3 border-0 rounded rounded-r-none text-2xl text-gray-600"
                                >
                                    <Globe
                                        size={24}
                                    />
                                </div>
                            </div>
                            <input
                                type="text"
                                name="subdomain"
                                required
                                value={subdomain}
                                className="flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-10 border-grey-light rounded rounded-l-none px-2 self-center relative text-gray-700 text-lg outline-none dark:text-gray-600"
                                placeholder="workspace"
                                onChange={handleChange}
                            />
                            <div className='flex items-center justify-start px-4'>
                                <p className='text-gray-400 text-sm '>
                                    .univex.com
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-wrap items-stretch border border-[#0B465440] w-full mb-5 relative h-14 bg-white rounded-lg">
                            <div className="flex -mr-px justify-center w-15 py-4 pl-2">
                                <div
                                    className="flex items-center leading-normal bg-white px-3 border-0 rounded rounded-r-none text-2xl text-gray-600"
                                >
                                    <MailIcon
                                        size={24}
                                    />
                                </div>
                            </div>
                            <input
                                type="email"
                                required
                                name='email'
                                id='email'
                                className="flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-10 border-grey-light rounded rounded-l-none px-2 self-center relative text-xl outline-none dark:text-gray-600"
                                placeholder="Email address"
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="disabled:cursor-not-allowed disabled:opacity-90 flex justify-center items-center gap-2 w-full transform rounded-lg shadow-lg bg-primary px-6 py-3 mb-3 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:opacity-90 focus:outline-none"
                        >
                            Send {isLoading && <span className='loading-spinner animate-spinner'></span>}
                        </button>

                        <button
                            onClick={() => { setModalOpenState("login") }}
                            className="w-full transform rounded-lg shadow-lg bg-[#8781E8] px-6 py-3 mb-5 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:opacity-90 focus:outline-none">Back to Login</button>
                    </form>
                </>
            }

        </div>
    )
}

export default ManagerForgetPassword