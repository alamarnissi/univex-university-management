import Image from 'next/image';
import LoginForm from '@/components/forms/auth-forms/LoginForm';
import authbgImg from "@/components/Common/assets/authBg.png"
import { fetchWSname } from '@/lib/fetch/FetchWorkspaces';
import { notFound } from 'next/navigation';

const LoginStudent = async ({params: {locale, domain}}: {params: {locale: string, domain: string}}) => {

  const workspace = await fetchWSname(domain);
  
  if (workspace?.status === 404) {
    notFound();
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
        <LoginForm
          title="Let&apos;s start the learning journey !"
          type="student"
          forgetPasswordUrl={`/forget-password/students`}
          currentWorkspace={domain}
        />
      </div>
    </div>
  )
}

export default LoginStudent