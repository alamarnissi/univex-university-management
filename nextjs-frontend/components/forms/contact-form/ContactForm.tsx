"use client"

import { useToast } from "@/components/ui/toast/use-toast";
import { useState } from "react";
import {useTranslations} from 'next-intl';

const ContactForm = () => {
  const t = useTranslations('LandingPage');

  const { toast } = useToast(); 
  const [isLoading, setIsLoading] = useState(false);
  const [formValue, setFormValue] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    message: ""
  });

  const { full_name, email, phone_number, message } = formValue;

  const inputLabelStyle = "mb-2 block text-sm text-gray-600 dark:text-black";
  const inputStyle = "min-w-[300px] rounded-none border-0 border-b border-b-[#F1F1F1] placeholder-[#6373815E] mt-2 block w-full border-gray-200 bg-white py-3 text-gray-700 focus:outline-none";
  
  const sendMessage = async () => {
    try {
      setIsLoading(true);

      // 👇 Send a fetch request to Backend API.
      await fetch(process.env.NEXT_PUBLIC_AUTH_API_URL+"/v1/contact/send_message?receiver_email=ala.marnissi30@gmail.com", {
        mode: "cors",
        method: "POST",
        body: JSON.stringify({
          full_name,
          email,
          phone_number,
          message
        }),
        headers: {
          "content-type": "application/json",
        },
      })
      .then((response) => {
          if(response.status === 200) {
            toast({variant: "success", description: "You Message has been sent Successfully"});
          }else if(response.status === 422) {
            toast({variant: "destructive", description: "Please Enter Valid Data"})
          }else{
              toast({variant: "destructive", description: "Something went wrong"});
          };
          setIsLoading(false);
        }
      ).catch((e) => toast({variant: "destructive", description: e.message}));
    } catch (err) {
        setIsLoading(false); // Stop loading in case of error
        toast({variant: "destructive", description: "An Error Has Occurred"});
        console.error(err);
    }
    
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFormValue((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setFormValue((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  return (
    <div className="mt-8 lg:mx-6 w-auto md:min-w-[450px]">
            <div className="mx-auto w-full overflow-hidden rounded-xl bg-white px-8 py-10 shadow-2xl lg:max-w-xl">
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-700 dark:text-black">{t("ContactSection.form.heading")}</h1>

            <form 
              className="mt-6" 
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}>
                <div className="flex-1">
                <label className={`${inputLabelStyle}`}>{t("ContactSection.form.labels.fullName")}<span className="text-[#D9186C]">*</span></label>
                <input 
                  type="text" 
                  name="full_name"
                  required
                  value={full_name}
                  placeholder={t("ContactSection.form.placeholders.fullName")} 
                  className={`${inputStyle}`} 
                  onChange={handleChange}
                />
                </div>

                <div className="mt-6 flex-1">
                <label className={`${inputLabelStyle}`}>{t("ContactSection.form.labels.email")}<span className="text-[#D9186C]">*</span></label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={email}
                  placeholder="yourname@example.com" 
                  className={`${inputStyle}`} 
                  onChange={handleChange}
                />
                </div>

                <div className="mt-6 flex-1">
                <label className={`${inputLabelStyle}`}>{t("ContactSection.form.labels.phone")}<span className="text-[#D9186C]">*</span></label>
                <input 
                  type="text" 
                  name="phone_number"
                  required
                  value={phone_number}
                  placeholder="+216 51 02 15 02" 
                  className={`${inputStyle}`} 
                  onChange={handleChange}
                />
                </div>

                <div className="mt-6 w-full">
                <label className={`${inputLabelStyle}`}>{t("ContactSection.form.labels.message")}<span className="text-[#D9186C]">*</span></label>
                <textarea 
                  name="message"
                  required
                  className={`${inputStyle}`} 
                  defaultValue={message}
                  placeholder={t("ContactSection.form.placeholders.message")}
                  onChange={handleTextAreaChange}
                ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="disabled:cursor-not-allowed disabled:opacity-90 flex justify-center items-center gap-2  mt-6 transform rounded-md bg-primary px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:opacity-90 focus:outline-none"
                >
                    {t("ContactSection.form.submit")} {isLoading && <span className='loading-spinner animate-spinner'></span>}
                </button>
            </form>
            </div>
        </div>
  )
}

export default ContactForm