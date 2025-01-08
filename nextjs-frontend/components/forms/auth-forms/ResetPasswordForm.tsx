
"use client"
import { useToast } from '@/components/ui/toast/use-toast';
import { navigate } from '@/lib/actions/navigate.action';
import { FetchResetPassword } from '@/lib/fetch/Auth';
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

const ResetPasswordForm = ({ type, loginUrl, currentWorkspace }: { type: string, loginUrl: string, currentWorkspace: string }) => {
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRetypePassword, setShowRetypePassword] = useState(false);

    const router = useRouter();
    const params = useSearchParams();
    const token = params.get("forget_password_token") as string;

    const flexCenter = "flex flex-col justify-center items-center gap-4";

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsLoading(true);

        try {
            const password = event.currentTarget.password.value;
            const retype_password = event.currentTarget.retype_password.value;

            if (password !== retype_password) {
                toast({ variant: "destructive", description: "Passwords do not match" });
                setIsLoading(false);
                return;
            } else if (password.length < 8) {
                toast({ variant: "destructive", description: "Password must be at least 8 characters" });
                setIsLoading(false);
                return;
            } else {
                const response = await FetchResetPassword(password, token, type);

                if (response) {
                    if (response.status >= 200 && response.status < 300) {
                        toast({ variant: "success", description: response.message });
                        // router?.push(`/login/${type}s`);
                        await navigate(loginUrl);
                    } else {
                        toast({ variant: "destructive", description: response.message });
                    }
                    setIsLoading(false);
                }
            }

        } catch (err) {
            setIsLoading(false); // Stop loading in case of error
            toast({ variant: "destructive", description: "An Error Has Occurred" });
            console.error(err);
        }
    }

    return (
        <div className={`${flexCenter} sm:min-w-[300px] md:min-w-[400px]`}>
            <div className={`${flexCenter} mb-5 md:mb-7.5 max-w-[400px]`}>
                <p className='text-center text-lg md:text-2xl font-medium leading-[20px] md:leading-[29px] dark:text-black'>Reset your password</p>
                <p className='text-center font-medium font-base text-[#00000050]'>Please enter your new password.</p>
            </div>

            <form
                className='w-full'
                onSubmit={handleSubmit}
            >
                <div className="overflow-hidden flex-1 flex flex-wrap items-stretch border border-[#0B465440] w-full relative h-14 bg-white rounded-lg mb-5 pr-2">
                    <div className="flex -mr-px justify-center w-15 py-4 pl-2">
                        <div
                            className="flex items-center leading-normal bg-white rounded rounded-r-none text-xl px-3 whitespace-no-wrap text-gray-600"
                        >
                            <LockIcon
                                size={24}
                            />
                        </div>
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        minLength={8}
                        className="flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-10 px-2 relative self-center text-xl outline-none dark:text-gray-600"
                        placeholder="Password"
                    />
                    <div className="flex -mr-px">
                        <div
                            className="flex items-center leading-normal bg-white rounded rounded-l-none border-0 px-3 whitespace-no-wrap text-gray-600 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeIcon size={24} /> : <EyeOffIcon size={24} />}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden flex-1 flex flex-wrap items-stretch border border-[#0B465440] w-full relative h-14 bg-white rounded-lg mb-5 pr-2">
                    <div className="flex -mr-px justify-center w-15 py-4 pl-2">
                        <div
                            className="flex items-center leading-normal bg-white rounded rounded-r-none text-xl px-3 whitespace-no-wrap text-gray-600"
                        >
                            <LockIcon
                                size={24}
                            />
                        </div>
                    </div>
                    <input
                        type={showRetypePassword ? "text" : "password"}
                        name="retype_password"
                        required
                        minLength={8}
                        className="flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-10 px-2 relative self-center text-xl outline-none dark:text-gray-600"
                        placeholder="Retype Password"
                    />
                    <div className="flex -mr-px">
                        <div
                            className="flex items-center leading-normal bg-white rounded rounded-l-none border-0 px-3 whitespace-no-wrap text-gray-600 cursor-pointer"
                            onClick={() => setShowRetypePassword(!showRetypePassword)}
                        >
                            {showRetypePassword ? <EyeIcon size={24} /> : <EyeOffIcon size={24} />}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="disabled:cursor-not-allowed disabled:opacity-90 flex justify-center items-center gap-2 w-full transform rounded-lg shadow-lg bg-primary px-6 py-3 mb-5 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:opacity-90 focus:outline-none"
                >
                    Reset Password {isLoading && <span className='loading-spinner animate-spinner'></span>}
                </button>
            </form>  

        </div>
    )
}

export default ResetPasswordForm