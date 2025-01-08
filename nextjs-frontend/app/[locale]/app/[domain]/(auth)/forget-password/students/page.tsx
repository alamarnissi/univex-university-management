
import Image from 'next/image';
import ForgetPasswordForm from '@/components/forms/auth-forms/ForgetPasswordForm';

import authbgImg from "@/components/Common/assets/authBg.png"
import { notFound } from 'next/navigation';
import ResetPasswordForm from '@/components/forms/auth-forms/ResetPasswordForm';
import { fetchWSname } from '@/lib/fetch/FetchWorkspaces';

const ForgetPasswordStudent = async ({params: {locale, domain}}: {params: {locale: string, domain: string}}) => {

  const workspace = await fetchWSname(domain);
  
  if (workspace?.status === 404) {
    notFound();
  }

  // const params = useSearchParams();
  // const token = params.get("forget_password_token") as string;
  let params;
  let token;
  if (typeof document !== "undefined") {
    params = new URL(document.location.toString()).searchParams;
    token = params.get("forget_password_token") as string;
  }

  return (
    <div className='h-screen flex flex-col md:flex-row items-stretch'>
        <div className={`relative bg-cover bg-no-repeat bg-right-bottom md:flex-1 w-1/2 h-max md:h-full flex justify-center items-center py-10 px-8 md:px-12`}>
            <Image 
              src={authbgImg}
              alt='background'
              fill
              className='absolute z-0'
            />
            <p className='z-10 text-[#F9F9F9] font-semibold text-2xl md:text-4xl px-2 md:px-4 text-center !leading-normal'>{`Welcome to ${workspace?.data?.name} Academy !`}</p>
        </div>
        <div className='md:flex-1 h-full flex justify-center items-center py-8 px-6 '>
          {token ? 
          <ResetPasswordForm 
            type={"student"} 
            loginUrl={`/login/students`}
            currentWorkspace={domain}
            />
          :
          <ForgetPasswordForm 
              type="student"
              loginUrl={`/login/students`}
              currentWorkspace={domain}
            />
        }
        </div>
    </div>
  )
}

export default ForgetPasswordStudent