"use client"
import { useToast } from '@/components/ui/toast/use-toast';
import { fetchAddInstructorToWS } from '@/lib/fetch/FetchInstructors';
import { useControlsStore } from '@/stores/useGlobalStore';
import { useRef, useState } from 'react';
import { useSWRConfig } from 'swr';

const AddInstructorForm = ({setModalOpen}: {setModalOpen: (value: boolean) => void}) => {
    const fetchUrl = process.env.NEXT_PUBLIC_AUTH_API_URL + "/v1/instructors/list";

    const {
        sortValue,
        searchValue
    } = useControlsStore();

    const { toast } = useToast(); 
    const { mutate } = useSWRConfig();
    const [isLoading, setIsLoading] = useState(false);

    const inputUsername = useRef<HTMLInputElement>(null)
    const inputEmail = useRef<HTMLInputElement>(null)

    interface FormDataType {username:string, email: string}
    const formData: FormDataType = {username: "", email: ""}


    const handleSubmit = async () => {
        try{
            setIsLoading(true);

            formData.username = inputUsername?.current?.value || "";
            formData.email = inputEmail?.current?.value || "";

            const response = await fetchAddInstructorToWS({instructor: formData});

            if(response){
                if(response.status >= 200 && response.status < 300){
                    toast({variant: "success", description: response.message});
                    mutate([fetchUrl, sortValue, searchValue])
                }else{
                    toast({variant: "destructive", description: response.message});
                }
                setIsLoading(false);
                setModalOpen(false);
            }

        }catch(err) {
            setIsLoading(false);
            toast({variant: "destructive", description: "An Error Has Occurred"});
            console.error(err)
        }
    }  

    return (
        <div className='pt-8 pb-2 px-3 flex flex-col justify-center gap-4'>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <div className='self-stretch pr-0 md:pr-5 leading mb-3'>
                    <label htmlFor="first_name" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        ref={inputUsername}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Instructor Name"
                        required
                    />
                </div>
                <div className='self-stretch pr-0 md:pr-5 leading'>
                    <label htmlFor="name" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                        Adresse Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        ref={inputEmail}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="your.name@example.com"
                        required
                    />
                </div>
                <div className='mt-4'>
                    <div className='flex items-center justify-start md:justify-end mt-7 md:mt-0'>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="disabled:cursor-not-allowed disabled:opacity-90 justify-center text-white inline-flex gap-2 items-center bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            Add {isLoading && <span className='loading-spinner animate-spinner'></span>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddInstructorForm