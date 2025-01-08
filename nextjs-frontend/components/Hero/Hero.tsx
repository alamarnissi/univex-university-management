import clsx from 'clsx'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/lib/styles'
import BoxSection from './elements/BoxSection'
import ModalVideo from '../modals/ModalVideo'

// images
import emailImage from "./assets/email.svg";
import heroImage from "./assets/hero_image.png"
import shapeImage from "./assets/hero_shape.svg"
import thoughtsImage from "./assets/thought.svg"
import dotsImage from "./assets/dotted_shape.svg"


const Hero = ({ t, locale }: { t: any, locale: string }) => {

  return (
    <>
      <section id="home" className={`${styles.paddingX} ${styles.flexStart} relative z-10 overflow-hidden pt-[120px] md:pt-[150px] xl:pt-[180px] 2xl:pt-[210px] sm:pb-16 pb-6`}>
        <div className={`${styles.boxWidth}`}>
          <div className="container px-4 mx-auto">
            <div className="flex flex-wrap xl:items-center -mx-4">
              <div className="w-full md:w-1/2 px-4 mb-16 md:mb-0">
                <h2 className="mb-6 md:mb-8 lg:mb-12 font-bold !leading-tight text-black text-3xl sm:text-4xl lg:text-[42px]">
                  {t("heroSection.heading")} <span className='text-secondary'>Univex</span>
                </h2>
                <p className="mb-6 md:mb-8 lg:mb-12 mr-3 lg:mr-0 text-md leading-normal lg:!leading-loose text-body-color dark:text-gray-950">
                  {t("heroSection.desc")}
                </p>
                <div className="flex flex-wrap gap-4 justify-between sm:justify-normal">

                  <div
                    className={clsx(
                      "w-auto xs:w-auto py-1 md:py-0 ",
                      locale === "ar" ? "md:ml-4" : "md:mr-4"
                    )}>
                    <Link
                      href="#"
                      className="inline-block w-full ease-in-up flex-auto rounded-md bg-primary py-4 px-4 text-base font-bold text-white transition duration-300 hover:opacity-90 md:px-9 lg:px-6 xl:px-9"
                    >
                      { t("heroSection.btnStart") }
                    </Link>
                  </div>
                  <div className="w-auto xs:w-auto py-1 md:py-0 flex items-center">
                    <ModalVideo
                      demoText={ t("heroSection.btnDemo") }
                      locale={locale}
                      video={`https://youtu.be/qm-dzZHGJRA`}
                      videoWidth={'100%'}
                      videoHeight={'100%'} />
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 px-4">
                <div className="relative mx-auto md:mr-0 max-w-max">
                  <Image 
                    className="absolute z-10 -left-6 sm:-left-14 -top-5 w-auto" 
                    src={shapeImage} alt="" width={21} height={21} />
                  <div className="absolute z-10 -left-6 sm:-left-14 -bottom-4 xs:bottom-12 md:-bottom-4 lg:bottom-12 md:w-auto">
                    <BoxSection
                      image={thoughtsImage}
                      title='Thought Leaders Class'
                      text='Today at 14.OO PM'
                      buttonText='Join Now'
                    />
                  </div>
                  <div className="absolute z-10 -right-12 bottom-2/4 md:w-auto">
                    <BoxSection
                      image={emailImage}
                      title='Congratulation'
                      text='You Received an E-mail'
                      imgBg='bg-[#D9186C]'
                      imgSize={21}
                    />
                  </div>
                  <Image className="absolute z-1 -right-7 -bottom-8 w-20 md:w-auto" src={dotsImage} alt="" width={100} height={100} />
                  <Image
                    className="relative z-2 rounded-7xl w-auto"
                    src={heroImage}
                    alt=""
                    priority
                    width={550}
                    height={550} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero;