"use client"
import { useToast } from '@/components/ui/toast/use-toast';
import { navigate } from '@/lib/actions/navigate.action';
import { fetchWSname } from '@/lib/fetch/FetchWorkspaces';
import { getPathWithSubdomain } from '@/lib/utils';
import { useManagerModalStore } from '@/stores/useManagerModalStore';
import { Globe } from 'lucide-react';
import React, { useState } from 'react'

const CheckSubdomainForm = () => {
    const { toast } = useToast();
    const { setModalOpenState } = useManagerModalStore();
    const [isLoading, setIsLoading] = useState(false);

    const [formValue, setFormValue] = useState({
        subdomain: "",
    });

    const { subdomain } = formValue;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    }

    const handleCheckSubdomain = async (data: { subdomain: string }) => {
        const { subdomain } = data;
        try {
            setIsLoading(true);
            "use server"
            const res = await fetchWSname(subdomain);

            if (res.status >= 200 && res.status < 300) {
                toast({ variant: "success", description: "Workspace found successfully!" });

                // Construct the new URL by inserting the subdomain
                const newUrl = getPathWithSubdomain(subdomain) + "?modalopen=login";

                await navigate(newUrl);
            } else {
                toast({ variant: "destructive", description: "Workspace not found!" });
            }
        } catch (err) {
            console.error(err)
        }
        setIsLoading(false); 
    }
    const flexCenter = "flex flex-col justify-center items-center gap-4";

    return (
        <>
            <div className={`${flexCenter}`}>
                <p className='text-center text-lg md:text-2xl font-semibold leading-[20px] md:leading-[29px]'>Welcome Back</p>
                <p className='text-center font-medium text-lg'>Login to your online academy, Please enter your subdomain.</p>
            </div>

            <div className={`${flexCenter}`}>
                <form
                    className='w-full flex flex-col items-center justify-center mt-8'
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleCheckSubdomain(formValue);
                    }}
                >

                    <div className="flex-1 flex flex-wrap items-stretch self-center border border-[#0B465440] w-full max-w-[450px] mb-4 relative h-14 bg-white rounded-lg">
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
                    <button
                        disabled={isLoading}
                        type='submit'
                        className="disabled:cursor-not-allowed disabled:opacity-90 max-w-[450px] flex justify-center items-center gap-2 w-full transform rounded-lg shadow-lg bg-primary px-6 py-3 mb-0 font-medium tracking-wide text-white transition-colors duration-300 hover:opacity-90 focus:outline-none"
                    >
                        Submit {isLoading && <span className='loading-spinner animate-spinner'></span>}
                    </button>
                </form>
                <div className={`${flexCenter}`}>
                    <p className='text-center font-base text-[#00000080]'>Don&apos;t have an account? <span className='text-primary hover:opacity-90 underline cursor-pointer' onClick={() => setModalOpenState("register")}>Sign up</span></p>
                </div>
            </div>
        </>
    )
}

export default CheckSubdomainForm