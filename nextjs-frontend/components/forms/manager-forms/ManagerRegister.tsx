"use client"

import { Fragment, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ManagerType } from '@/lib/types/manager';
import { Listbox, Transition } from '@headlessui/react'
import { FetchRegisterManager } from '@/lib/fetch/Auth';
import { useToast } from '@/components/ui/toast/use-toast';
import RedirectLoader from '@/components/Common/RedirectLoader';
import { useEmailToVerify, useManagerModalStore } from '@/stores/useManagerModalStore';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, PhoneIcon, UserCircle2Icon, Users2Icon } from 'lucide-react';
import { BuildingIcon } from 'lucide-react';
import { generateSimilarBusinessNames } from '@/lib/utils';
// import googleIcon from "@/components/Common/assets/google_icon.svg";

const Profession = [
    { id: 0, name: '', unavailable: true },
    { id: 1, name: 'Training Center', unavailable: false },
    { id: 2, name: 'Corporate', unavailable: false },
    { id: 3, name: 'Educational Institution', unavailable: false },
    { id: 4, name: 'Solo Educator', unavailable: false },
]


const ManagerRegister = () => {
    const { toast } = useToast();
    const pathname = usePathname();
    const router = useRouter();
    const { setModalOpenState } = useManagerModalStore();
    const { setEmailToVerify } = useEmailToVerify()

    const [showPassword, setShowPassword] = useState(false);
    const [formValue, setFormValue] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        institution_type: Profession[0],
        learning_business_name: "",
        password: ""
    });

    const {
        email,
        first_name,
        last_name,
        phone_number,
        institution_type,
        learning_business_name,
        password
    } = formValue;
    const [businessSuggestions, setBusinessSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

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
    };

    const handleRegister = async (manager: ManagerType) => {
        try {
            setIsLoading(true);

            const response = await FetchRegisterManager(manager);

            if (response) {
                const data = await response.json();
                if (data.status >= 200 && data.status < 300) {
                    setEmailToVerify(manager.email);
                    toast({ variant: "success", description: data.message });
                    setIsRedirecting(true);

                    router?.push(`${pathname}?modalopen=verify_email&submit_email=${manager.email}&email_status=notVerified`);

                    setModalOpenState("verify_email");
                    setIsRedirecting(false);
                } else if (data.status === 409) {
                    toast({ variant: "destructive", description: data.message });
                    const suggestions = generateSimilarBusinessNames(manager.learning_business_name);
                    setBusinessSuggestions(suggestions)
                } else {
                    toast({ variant: "destructive", description: data.message });
                };
                setIsLoading(false);

            }
        } catch (err) {
            setIsLoading(false); // Stop loading in case of error
            toast({ variant: "destructive", description: "An Error Has Occurred" });
            console.error(err);
        }
    }

    if (isRedirecting) return <><RedirectLoader message='we are sending you a verification email' /></>

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
            <div className={`flex flex-col items-center gap-4 sm:min-w-[300px] md:min-w-[450px] h-[600px] md:h-[628px] overflow-y-scroll no-scrollbar px-8 md:px-10 py-12`}>
                <div className={`${flexCenter} mb-5 md:mb-7.5`}>
                    <p className='text-center text-xl md:text-2xl font-medium leading-[20px] md:leading-[29px] dark:text-black'>Let’s start the journey !</p>
                    <p className='text-center text-lg md:font-xl text-black'>Create your account</p>
                </div>

                <form
                    className='w-full'
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleRegister(formValue);
                    }}
                >
                    {/* First Name */}
                    <div className="flex-1 flex flex-wrap items-stretch border border-[#0B465440] w-full mb-3 relative h-14 bg-white rounded-lg">
                        <div className="flex -mr-px justify-center w-15 py-4 pl-2">
                            <div
                                className="flex items-center leading-normal bg-white px-3 border-0 rounded rounded-r-none text-2xl text-gray-600"
                            >
                                <UserCircle2Icon
                                    size={24}
                                />
                            </div>
                        </div>
                        <input
                            type="text"
                            name="first_name"
                            required
                            min={2}
                            max={50}
                            value={first_name}
                            className="flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-10 border-grey-light rounded rounded-l-none px-2 self-center relative text-xl outline-none dark:text-gray-600"
                            placeholder="First Name"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Last Name */}
                    <div className="flex-1 flex flex-wrap items-stretch border border-[#0B465440] w-full mb-3 relative h-14 bg-white rounded-lg">
                        <div className="flex -mr-px justify-center w-15 py-4 pl-2">
                            <div
                                className="flex items-center leading-normal bg-white px-3 border-0 rounded rounded-r-none text-2xl text-gray-600"
                            >
                                <UserCircle2Icon
                                    size={24}
                                />
                            </div>
                        </div>
                        <input
                            type="text"
                            name="last_name"
                            required
                            min={2}
                            max={50}
                            value={last_name}
                            className="flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-10 border-grey-light rounded rounded-l-none px-2 self-center relative text-xl outline-none dark:text-gray-600"
                            placeholder="Last Name"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="flex-1 flex flex-wrap items-stretch border border-[#0B465440] w-full mb-3 relative h-14 bg-white rounded-lg">
                        <div className="flex -mr-px justify-center w-15 py-4 pl-2">
                            <div
                                className="flex items-center leading-normal bg-white px-3 border-0 rounded rounded-r-none text-2xl text-gray-600"
                            >
                                <PhoneIcon
                                    size={24}
                                />
                            </div>
                        </div>
                        <input
                            type="text"
                            name="phone_number"
                            required
                            pattern='[^\+\d{1,3}\d{10,15}$]'
                            value={phone_number}
                            className="flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-10 border-grey-light rounded rounded-l-none px-2 self-center relative text-xl outline-none dark:text-gray-600"
                            placeholder="+885 1254 5211 552"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email Address */}
                    <div className="flex-1 flex flex-wrap items-stretch border border-[#0B465440] w-full mb-3 relative h-14 bg-white rounded-lg">
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
                            className="flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-10 border-grey-light rounded rounded-l-none px-2 self-center relative text-xl outline-none dark:text-gray-600"
                            placeholder="Email address"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password */}
                    <div className="overflow-hidden flex-1 flex flex-wrap items-stretch border border-[#0B465440] w-full relative h-14 bg-white rounded-lg mb-3 pr-2">
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
                            className="flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-10 px-2 relative self-center text-xl outline-none dark:text-gray-600"
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

                    {/* Institution Type */}
                    <div className="flex-1 flex flex-wrap items-stretch border border-[#0B465440] w-full mb-3 relative h-14 bg-white rounded-lg">
                        <div className="flex -mr-px justify-center w-15 py-4 pl-2">
                            <div
                                className="flex items-center leading-normal bg-white px-3 border-0 rounded rounded-r-none text-2xl text-gray-600"
                            >
                                <Users2Icon
                                    size={24}
                                />
                            </div>
                        </div>
                        <Listbox
                            value={institution_type}
                            onChange={(institution_type) => setFormValue((prev) => { return { ...prev, institution_type } })}
                        >
                            <Listbox.Button
                                as={Fragment}
                            >
                                <input
                                    type="text"
                                    required
                                    name="institution_type"
                                    placeholder='You are?'
                                    className="flex-shrink flex-grow flex-auto text-start leading-normal w-px border-0 h-10 border-grey-light rounded rounded-l-none px-2 self-center relative text-xl outline-none dark:text-gray-600"
                                    value={institution_type.name}
                                    onChange={handleChange}
                                />

                            </Listbox.Button>
                            <Transition
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                                className="absolute top-full z-10 w-full bg-white px-7 py-5 shadow-lg rounded-lg mt-1"
                            >
                                <Listbox.Options>
                                    {Profession.map((profession) => (
                                        <Listbox.Option
                                            key={profession.id}
                                            value={profession}
                                            disabled={profession.unavailable}
                                            className="cursor-pointer hover:text-primary"
                                        >
                                            {profession.name}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </Listbox>
                    </div>

                    {/* Agency */}
                    <div className="flex-1 flex flex-wrap items-stretch border border-[#0B465440] w-full mb-3 relative h-14 bg-white rounded-lg">
                        <div className="flex -mr-px justify-center w-15 py-4 pl-2">
                            <div
                                className="flex items-center leading-normal bg-white px-3 border-0 rounded rounded-r-none text-2xl text-gray-600"
                            >
                                <BuildingIcon
                                    size={24}
                                />
                            </div>
                        </div>
                        <input
                            type="text"
                            name="learning_business_name"
                            required
                            value={learning_business_name}
                            className="flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-10 border-grey-light rounded rounded-l-none px-2 self-center relative text-xl outline-none dark:text-gray-600"
                            placeholder="Institution Name"
                            onChange={handleChange}
                        />

                    </div>
                    {businessSuggestions.length > 0 && (
                        <div className='flex items-center justify-start space-x-2 mb-5'>
                            <p className='font-semibold'>Suggestions:</p>
                            <ul className='flex items-center gap-3 text-sm'>
                                {businessSuggestions.map((suggestion) => (
                                    <li 
                                        key={suggestion}
                                        className='cursor-pointer hover:text-black/60'
                                        onClick={() => setFormValue((prev) => { return { ...prev, learning_business_name: suggestion } })}
                                    >{suggestion}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="disabled:cursor-not-allowed disabled:opacity-90 flex justify-center items-center gap-2 w-full transform rounded-lg shadow-lg bg-primary px-6 py-3 mb-3 text-sm font-medium uppercase tracking-wide text-white transition-colors duration-300 hover:opacity-90 focus:outline-none"
                    >
                        Sign Up {isLoading && <span className='loading-spinner animate-spinner'></span>}
                    </button>
                </form>
                {/* <div className={`${flexCenter} w-full`}>
                <button
                    className={`${socialBtn}`}
                    onClick={() => signIn('google', {callbackUrl: '/dashboard'})}
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
            </div> */}
                <div className={`flex justify-center items-center gap-2 text-gray-600`}>
                    <p className='text-center font-base text-[#00000080]'>Have an account? <span className='text-primary hover:opacity-90 underline cursor-pointer' onClick={() => { setModalOpenState("check_subdomain") }}>Login in now</span></p>
                </div>
            </div>
        </div>
    )
}

export default ManagerRegister