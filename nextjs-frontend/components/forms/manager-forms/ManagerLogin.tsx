"use client"

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast/use-toast';
import { useManagerModalStore } from '@/stores/useManagerModalStore';
import RedirectLoader from '@/components/Common/RedirectLoader';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from 'lucide-react';
// import googleIcon from "@/components/Common/assets/google_icon.svg";
import { getCookie } from 'cookies-next';
import { navigate } from '@/lib/actions/navigate.action';
import { useWSGlobalStore } from '@/stores/useWSStore';


const ManagerLogin = ({subdomain}: {subdomain?: string}) => {
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();
    const { setModalOpenState } = useManagerModalStore();
    const { workspace_subdomain } = useWSGlobalStore();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [formValue, setFormValue] = useState({
        email: "",
        password: ""
    });
    console.log(workspace_subdomain)
    const { email, password } = formValue;

    const flexCenter = "flex flex-col justify-center items-center gap-4";
    const socialBtn = "w-full py-3.5 flex justify-center items-center gap-4 text-gray-600 text-center border border-[#0B465440] rounded-xl hover:text-primary hover:border-primary";

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    }

    const handleLogin = async (data: { email: string, password: string }) => {
        try {
            setIsLoading(true);

            "use server"
            const res = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
                workspace_subdomain: subdomain as string,
                type: "manager",
            });

            if (res) {
                if (res === undefined) {
                    toast({ variant: "destructive", description: "Invalid credentials" });
                } else {
                    if (res?.ok) {
                        toast({ variant: "success", description: "Successfully logged in" });
                        setIsRedirecting(true);
                    } else {
                        if (res?.error) {
                            
                            if (res?.error === "CredentialsSignin") {
                                toast({ variant: "destructive", description: "Invalid credentials" })
                            } else {
                                toast({ variant: "destructive", description: "Something went wrong" });
                            }
                        }
                    };
                }
            }
            if (res?.url) {
                router?.push("/dashboard");
                // window.location.href = "/dashboard";
            };

            // if route contain /dashboard setIsRedirection to false
            if (pathname?.includes("/dashboard")) setIsRedirecting(false);

        } catch (err) {

            toast({ variant: "destructive", description: "An Error Has Occurred" });
            console.error(err);
        }
        setIsLoading(false); // Stop loading in case of error
    }

    const handleSignInGoogle = async () => {
        try {
            const res = await signIn('google', { callbackUrl: "/dashboard" });
            const cookieStore = getCookie("is_new_user") as string;
            // const newUserFromGoogle = cookieStore.get("is_new_user");

            // res?.ok && console.log("this is the result of login ", res)
            if (res?.ok && cookieStore) {
                await navigate(`/?modalopen=verify_email&submit_email=${cookieStore}`)
            } else {
                await navigate(`/dashboard`)
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (isRedirecting) {
        return (
            <div className='px-8 md:px-14 py-10'>
                <RedirectLoader message='We&apos;re preparing your Workspace' />
            </div>
        )
    }

    return (
        <div className='block md:flex p-0 m-0'>
            <div className='hidden md:flex flex-col justify-between gap-4 items-start px-8 py-10 text-white sm:min-w-[300px] md:min-w-[400px] bg-gradient-to-b from-indigo-800 via-purple-700 to-purple-500'>
                <div className='flex flex-col gap-8 items-start'>
                    <p className='font-semibold uppercase mb-10'>
                        Univex
                    </p>
                    <p className='text-3xl font-semibold'>
                        Welcome to Univex!
                    </p>
                </div>
                <p className='text-sm font-semibold'>
                    © 2024 Univex. All Rights Reserved
                </p>
            </div>
            <div className={`${flexCenter} sm:min-w-[300px] md:min-w-[450px] px-8 md:px-10 py-12`}>
                <div className={`${flexCenter} mb-5 md:mb-7.5`}>
                    <p className='text-center text-lg md:text-2xl font-medium leading-[20px] md:leading-[29px] dark:text-black'>Login to your account</p>
                    <p className='text-center font-base text-[#00000080]'>Don&apos;t have an account? <span className='text-primary hover:opacity-90 underline cursor-pointer' onClick={() => setModalOpenState("register")}>Sign up</span></p>
                </div>
                {/* <div className={`${flexCenter} w-full`}>
                    <button
                        className={`${socialBtn}`}
                        onClick={handleSignInGoogle}
                    >
                        <Image
                            src={googleIcon}
                            alt="google icon"
                            width={18}
                            height={18}
                        />
                        <p>
                            Login with Google
                        </p>
                    </button>
                </div>
                <div className={`flex justify-center items-center gap-2 text-gray-600`}>
                    <span className='h-0.5 w-12 border bg-gray-600'></span>
                    <p className='text-sm font-normal dark:text-black'>Or with email and password</p>
                    <span className='h-0.5 w-12 border bg-gray-600'></span>
                </div> */}
                <form
                    className='w-full'
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin(formValue);
                    }}
                >
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
                            name="email"
                            required
                            value={email}
                            className="flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-10 border-grey-light rounded rounded-l-none px-2 self-center relative text-gray-700 text-lg outline-none dark:text-gray-600"
                            placeholder="Email address"
                            onChange={handleChange}
                        />
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
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            minLength={8}
                            value={password}
                            className="flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-10 px-2 relative self-center text-gray-700 text-lg outline-none dark:text-gray-600"
                            placeholder="Password"
                            onChange={handleChange}
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="disabled:cursor-not-allowed disabled:opacity-90 flex justify-center items-center gap-2 w-full transform rounded-lg shadow-lg bg-primary px-6 py-4 mb-5 text-sm font-medium uppercase tracking-wide text-white transition-colors duration-300 hover:opacity-90 focus:outline-none"
                    >
                        Sign In {isLoading && <span className='loading-spinner animate-spinner'></span>}
                    </button>

                    <p className='text-center font-base text-[#00000080]'>Forget your password ? <span className='text-primary hover:opacity-90 underline cursor-pointer' onClick={() => setModalOpenState("forget_password")}>Click here</span></p>
                </form>
            </div>
        </div>
    )
}

export default ManagerLogin