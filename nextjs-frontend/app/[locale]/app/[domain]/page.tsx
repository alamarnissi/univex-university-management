"use client"
import { useEffect } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ManagerModal from '@/components/modals/ManagerModal'
import { useManagerModalStore } from '@/stores/useManagerModalStore';

const WorkspaceFrontPage = ({params: {domain}}: {params: {domain: string}}) => {
  // Modal Toggle
  const {
    modalOpenState,
    setModalOpenState,
  } = useManagerModalStore();

  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const deleteQueryParam = async () => {
    const current = new URLSearchParams(Array.from(params.entries()));

    setModalOpenState("");
    current.delete("modalopen");

    // cast to string
    const search = current.toString();
    const query = search ? `?${search}` : "";

    router?.push(`${pathname}${query}`);
  }

  useEffect(() => {
    if (params.get("modalopen") === "login") {
      setModalOpenState("login");
    }
  }, [])

  return (
    <>
      <section className="ed-2-banner bg-edoffwhite pt-[120px] pb-[190px] relative z-[1] overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-x-[112px] gap-y-[40px] items-center">

            <div className="flex-1 md:min-w-[350px]">
              <h6 className="ed-section-sub-title !text-black before:!content-none">ONLINE <span className="text-primary">Learning</span> COURSE</h6>
              <h1 className="font-medium text-[clamp(35px,5.4vw,80px)] text-edblue tracking-tight leading-[1.12] mb-[25px]">Explore Your Skills With <span className="font-bold"><span className="inline-block text-primary relative before:absolute before:left-0 before:top-[calc(100%-6px)] before:w-[240px] before:h-[21px]">Online</span> Class</span></h1>
              <p className="text-edgray font-medium mb-[41px]">Smply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled</p>
              <div className="flex flex-wrap gap-[10px]">
                <Link href="#" onClick={() => setModalOpenState("login")} className="primary-action-btn !bg-transparent border border-primary !text-primary hover:!bg-primary/80 hover:!text-white">Login</Link>
                <Link href="#" className="primary-action-btn !bg-transparent border border-black !text-black hover:!bg-black hover:!text-white">about us</Link>
              </div>
            </div>


            <div className="flex-1 hidden md:block">
              <div className="w-max relative z-[1] flex gap-[30px] items-center">
                <Image src="/images/workspace_assets/banner-2-img-1.jpg" alt="banner image" width={241} height={330} className="border-[10px] border-white rounded-[20px] max-w-[241px] aspect-[261/366]" />
                <Image src="/images/workspace_assets/banner-2-img-2.jpg" alt="banner image" width={435} height={543} className="rounded-[20px]" />


                <div>
                  <div className="w-[242px] aspect-square rounded-full bg-primary opacity-80 blur-[110px] absolute -z-[1] bottom-0 left-[163px]"></div>
                  <img src="/images/workspace_assets/banner-2-img-vector-1.svg" alt="vector" width={69} height={54} className="pointer-events-none absolute -z[1] top-[30px] -left-[35px]" />
                  <img src="/images/workspace_assets/banner-2-img-vector-2.svg" alt="vector" width={75} height={54} className="pointer-events-none absolute -z[1] -top-[50px] -right-[40px]" />
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className='hidden md:block'>
          <img src="/images/workspace_assets/banner-2-vector-1.svg" alt="vector" width={156} height={159} className="pointer-events-none absolute -z-[1] top-[135px] left-[38px] xxxl:hidden" />
          <img src="/images/workspace_assets/banner-2-vector-2.svg" alt="vector" width={252} height={238} className="pointer-events-none absolute -z-[1] bottom-0 left-0" />
          <img src="/images/workspace_assets/banner-2-vector-3.svg" alt="vector" width={816} height={511} className="pointer-events-none absolute -z-[1] -bottom-[8px] right-0" />
        </div>
      </section>
      <ManagerModal modalOpen={modalOpenState} setModalOpen={setModalOpenState} subdomain={domain} />
    </>
  )
}

export default WorkspaceFrontPage