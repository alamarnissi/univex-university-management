import Image from "next/image"
import styles from "@/lib/styles"
import { PlatformData } from "@/lib/data"

// images
import platformImg from "./platform.png"


const Platform = ({ t, locale }: { t: any, locale: string }) => {

    return (
        <div id="platform" className={`${styles.flexStart} relative sm:my-16 sm:pl-16 pl-6 sm:pt-16 pb-0 pt-10`}>
            <div className={`${styles.boxWidth}`}>
                <div
                    className={`${locale === "ar" ? `md:flex-row-reverse` : `md:flex-row`} flex flex-col gap-5`}
                >
                    <div className="flex flex-col gap-14 sm:gap-16 flex-1">
                        <p className="font-normal text-lg dark:text-gray-950 sm:text-xl leading-9 sm:leading-[45px]">
                            <span className="font-bold">Univex</span> {t("PlatformSection.desc")}
                        </p>
                        <div className="grid grid-cols-2 gap-5 content-start mb-8">
                            {PlatformData && PlatformData.map(el => (
                                <div key={el.id} className="flex flex-col gap-5 items-start">
                                    <p className={`${el.bgColor && el.bgColor} text-2xl px-5 py-4 font-semibold text-white rounded-lg`}>0{el.id}</p>
                                    <p className="font-semibold leading-6 sm:leading-[32px] text-base sm:text-lg lg:text-xl dark:text-gray-950 pr-2 sm:pr-0">{t(el.title)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <Image
                            src={platformImg}
                            alt="platform"
                            width={650}
                            height={550}
                            className="md:absolute right-0"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Platform