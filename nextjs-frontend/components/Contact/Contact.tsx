
import Image from "next/image"
import styles from "@/lib/styles"
import ContactForm from "../forms/contact-form/ContactForm"
import { socialMedia } from "@/lib/data"

// images
import contactImg from "./contact_img.svg"
import envelopeImg from "./envelope.svg"

const Contact = ({t}: {t: any}) => {

  return (
    <div id="contact" className={`${styles.flexStart} relative `}>
        <div className={`${styles.padding} w-full flex justify-between`}>
            <div className="flex flex-col gap-10 w-full">
                <div className="flex-1 h-full flex flex-col gap-4 justify-center items-start pt-8">
                    <p className="uppercase text-base font-semibold dark:text-gray-900">{t("ContactSection.contactUs")}</p>
                    <p className="text-3xl font-semibold leading-[38px] dark:text-gray-900">{t("ContactSection.hearFromYou")}</p>
                </div>  
                
                <div className="lg:hidden flex mx-auto">
                    <ContactForm />
                </div>

                <div className={`flex-1 ml-6 flex flex-col sm:flex-row gap-4 pt-8`}>
                    <div className="flex items-end justify-center">
                        <Image 
                            src={contactImg}
                            alt="contact"
                            width={240}
                            height={154}
                        />
                    </div>
                    <div className="h-fit flex flex-row items-start justify-center sm:justify-normal gap-4">
                        <Image 
                            src={envelopeImg}
                            alt="envelope"
                            width={33}
                            height={23}
                        />
                        <div className="flex flex-col gap-3">
                            <p className="text-lg font-semibold leading-[24px] dark:text-gray-900">{t("ContactSection.howHelp")}</p>
                            <p className="text-base font-normal dark:text-gray-900">contact@univex.com</p>
                            <div className="flex gap-6 text-[#637381]">
                                {socialMedia && socialMedia.map(el => (
                                    <a href={el.link} key={el.id} target="_blank" rel="noopener noreferrer" >
                                        <Image 
                                            src={el.icon}
                                            alt={el.title}
                                            width={el.title === "facebook" ? 8 : 16}
                                            height={16}
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block">
                <ContactForm />
            </div>
            
        </div>
    </div>
  )
}

export default Contact