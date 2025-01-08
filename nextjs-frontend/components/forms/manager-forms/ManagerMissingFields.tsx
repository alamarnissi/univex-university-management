"use client"

import { Listbox, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react';
import { ManagerOAuthType } from '@/lib/types/manager';
import { FetchRegisterManager } from '@/lib/fetch/Auth';
import { useToast } from '@/components/ui/toast/use-toast';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { useCurrentUserState } from '@/stores/useGlobalStore';
import { LocalStorage } from '@/lib/LocalStorage';
import RedirectLoader from '@/components/Common/RedirectLoader';
import {PhoneIcon, UserCircle2Icon, Users2Icon } from 'lucide-react';
import { BuildingIcon } from 'lucide-react';
import { navigate } from '@/lib/actions/navigate.action';

const Profession = [
    { id: 0, name: '', unavailable: true },
    { id: 1, name: 'Training Center', unavailable: false },
    { id: 2, name: 'Corporate', unavailable: false },
    { id: 3, name: 'Educational institution', unavailable: false },
    { id: 4, name: 'Solo educator', unavailable: false },
  ]


const ManagerMissingFields = () => {
    const { initiateAuthUserState } = useCurrentUserState();
    const { toast } = useToast(); 
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isRedirecting, setIsRedirecting] = useState(false);
    const [formValue, setFormValue] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        institution_type: Profession[0],
        learning_business_name: "",
    });

    const {
        first_name, 
        last_name, 
        phone_number, 
        institution_type, 
        learning_business_name, 
    } = formValue;
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const flexCenter = "flex flex-col justify-center items-center gap-4";

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
          return {
            ...prevState,
            [name]: value,
          };
        });
    };

    const handleRegister = async (manager: ManagerOAuthType) => {
        try{
            setIsLoading(true);
            setErrorMsg("");

            const managerEmail = searchParams.get("email") || "";

            const managerReq = {
                email: managerEmail,
                ...manager
            }

            const res = await FetchRegisterManager(managerReq);
            const response = await res.json();
            if(response) {
                if(response.status == 200){
                    const tokenCookie = response.data.access_token;
                    initiateAuthUserState;
                    // localStorage.remove({name: "aca_current_user"});

                    if(tokenCookie){
                        setCookie("access_token", tokenCookie)

                        // retrieve data from token 
                        // const currentUser = await decodeJWT(tokenCookie);

                        // store current user info in global state and localstorage
                        // updateAuthUserState(currentUser);

                        toast({variant: "success", description: response.message});
                        setIsRedirecting(true);
                        await navigate("/dashboard");
                    }
                }else{
                    // setErrorMsg("Something went wrong");
                    toast({variant: "destructive", description: response.message});
                };
                setIsLoading(false);

                if (pathname.includes("dashboard")) {
                    setIsRedirecting(false);
                }
            }
        }catch(err){
            setIsLoading(false); // Stop loading in case of error
            toast({variant: "destructive", description: "An Error Has Occurred"});
            console.error(err);
        }
    }

    if (isRedirecting) return <><RedirectLoader message='We&apos;re preparing your Workspace' /></>

  return (
    <div className={`${flexCenter} sm:min-w-[300px] md:min-w-[400px]`}>
        <div className={`${flexCenter} mb-4 md:mb-7.5`}>
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
                    onChange={(institution_type) => setFormValue((prev) =>{ return {...prev, institution_type}})}
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

            {errorMsg && <div className='flex justify-center items-center mb-2'><p className='text-red-600 font-bold text-sm'>{errorMsg}</p></div>}
            <button 
                type="submit"
                disabled={isLoading}
                className="disabled:cursor-not-allowed disabled:opacity-90 flex justify-center items-center gap-2 w-full transform rounded-lg shadow-lg bg-primary px-6 py-3 mb-3 mt-4 text-sm font-medium uppercase tracking-wide text-white transition-colors duration-300 hover:opacity-90 focus:outline-none"
            >
                Sign Up {isLoading && <span className='loading-spinner animate-spinner'></span>}
            </button>
        </form>
        
    </div>
  )
}

export default ManagerMissingFields