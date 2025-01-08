"use client"

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast/use-toast';
import RedirectLoader from '@/components/Common/RedirectLoader';
import { EyeOffIcon, LockIcon, MailIcon } from 'lucide-react';
import { EyeIcon } from 'lucide-react';

const LoginForm = ({ title, type, forgetPasswordUrl, currentWorkspace }: { title: string, type: string, forgetPasswordUrl: string, currentWorkspace: string }) => {
    const flexCenter = "flex flex-col justify-center items-center gap-8";

    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [formValue, setFormValue] = useState({
        email: "",
        password: ""
    });
    const { email, password } = formValue;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    }

    const handleLogin = async (data: { email: string, password: string }, type: string) => {
        try {
            setIsLoading(true);
            const res = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
                workspace_subdomain: currentWorkspace,
                type: type,
            });


            if (res === undefined) {
                toast({ variant: "destructive", description: "Invalid credentials" });
            } else {
                if (res?.ok) {
                    toast({ variant: "success", description: "Successfully logged in" });
                    setIsRedirecting(true);
                } else {
                    if(res?.error) {
                        if (res?.error === "CredentialsSignin") {
                            toast({ variant: "destructive", description: "Invalid credentials" })
                        } else {
                            toast({ variant: "destructive", description: "Something went wrong" });
                        }
                    }
                };
            }

            if (res?.url) {
                // await navigate(`/dashboard`);
                router?.push("/dashboard");
            };

            // if route contain /dashboard setIsRedirection to false
            if (pathname?.includes("/dashboard")) setIsRedirecting(false);

        } catch (err) {
            toast({ variant: "destructive", description: "An Error Has Occurred" });
            console.error(err);
        }
        setIsLoading(false); // Stop loading in case of error
    }

    if (isRedirecting) return <><RedirectLoader message='We&apos;re taking you to Workspace' /></>

    return (
        <div className={`${flexCenter} sm:min-w-[300px] md:min-w-[400px]`}>
            <div className={`${flexCenter} mb-5 md:mb-7.5`}>
                <p className='text-center text-2xl md:text-3xl font-semibold leading-[20px] md:leading-[29px]'>{title}</p>
            </div>

            <form
                className='w-full'
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin(formValue, type);
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
                        className="flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-10 border-grey-light rounded rounded-l-none px-2 self-center relative text-xl outline-none"
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
                        value={password}
                        className="flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-10 px-2 relative self-center text-xl outline-none"
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
                    className="disabled:cursor-not-allowed disabled:opacity-90 flex justify-center items-center gap-2 w-full transform rounded-lg shadow-lg bg-primary px-6 py-3 mb-5 text-sm font-medium uppercase tracking-wide text-white transition-colors duration-300 hover:opacity-90 focus:outline-none"
                >
                    Sign In {isLoading && <span className='loading-spinner animate-spinner'></span>}
                </button>

                <p className='text-center font-base text-[#00000080]'>Forget your password ? <Link className='text-primary hover:opacity-90 underline cursor-pointer' href={forgetPasswordUrl}>Click here</Link></p>
            </form>
        </div>
    )
}

export default LoginForm