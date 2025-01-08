"use client"
import { useToast } from "@/components/ui/toast/use-toast";
import { FetchResendVerificationEmail } from "@/lib/fetch/Auth";
import { useEmailToVerify, useManagerModalStore } from "@/stores/useManagerModalStore";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const ManagerVerifyEmail = () => {
  const { emailToVerify } = useEmailToVerify();

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const params = useSearchParams();
  const emailParam = params.get("submit_email") as string;
  const emailStatus = params.get("email_status") as string;

  const {
    setModalOpenState,
  } = useManagerModalStore();

  // useEffect(() => {

  //   if (emailToVerify === "" && emailParam) {
  //     setEmailToVerify(emailParam);
  //   }

  // }, [emailParam, emailToVerify])

  const handleResendEmail = async () => {
    setIsLoading(true);

    const verificationEmail = emailToVerify || emailParam;

    try {

      const response = await FetchResendVerificationEmail(verificationEmail);
      if (response) {
        if (response.status >= 200 && response.status < 300) {
          toast({ variant: "success", description: "Verification email has been sent successfully!" });
         
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

  const flexCenter = "flex flex-col justify-center items-center gap-4";

  return (
    <div className={`${flexCenter} sm:min-w-[300px] md:min-w-[400px]`}>
      {emailStatus === "verified" ?
        <>
          <div className={`${flexCenter} `}>
            <p className='text-center text-lg md:text-2xl font-medium leading-[20px] md:leading-[29px] dark:text-black'>Congratulation!!</p>
            <p className='text-center font-medium text-lg'>Your email: <span className="text-primary">{emailParam}</span> has been verified successfully.</p>
          </div>

          <div className={`${flexCenter}`}>
            <p className='text-center font-medium font-base'>Let&apos;s start the journey</p>
            <button
              onClick={() => {
                setModalOpenState("check_subdomain");
              }}
              className="w-full transform rounded-lg shadow-lg bg-primary px-6 py-3 mb-0 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:opacity-90 focus:outline-none"
            >
              Connect To Proceed To Dashboard
            </button>
          </div>
        </>
        :
        <>
          <div className={`${flexCenter}`}>
            <p className='text-center text-lg md:text-2xl font-medium leading-[20px] md:leading-[29px]'>Verify your email</p>
            <p className='text-center font-medium text-lg'>We have sent a verification email to <span className="text-primary">{emailToVerify}</span>.</p>
          </div>

          <div className={`${flexCenter}`}>
            <p className='text-center font-medium font-base'>Didn&apos;t receive the email? Check spam or promotion folder or</p>
            <button
              disabled={isLoading}
              className="disabled:cursor-not-allowed disabled:opacity-90 flex justify-center items-center gap-2 w-full transform rounded-lg shadow-lg bg-primary px-6 py-3 mb-0 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:opacity-90 focus:outline-none"
              onClick={() => handleResendEmail()}
            >
              Resend Email {isLoading && <span className='loading-spinner animate-spinner'></span>}
            </button>
          </div>
        </>
      }
    </div>
  )
}

export default ManagerVerifyEmail