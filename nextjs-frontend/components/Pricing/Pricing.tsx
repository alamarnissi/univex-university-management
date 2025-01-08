
import clsx from "clsx"
import Image from "next/image"
import styles from "@/lib/styles"

// images
import ovalPrimary from "./assets/oval_primary.svg"
import ovalSecondary from "./assets/oval_secondary.svg"
import priceTop from "./assets/shape_price_top.svg"
import priceBottom from "./assets/shape_price_bottom.svg"

const Pricing = ({ t, locale }: { t: any, locale: string }) => {
    return (
        <div id="pricing" className={`${styles.flexStart} bg-[#F9F9F9] relative sm:px-16 px-6 py-16 sm:pb-16 sm:pt-32`}>
            <div className={`${styles.boxWidth}`}>
                <h2 className={`${styles.heading2} text-center mb-4`}>{t('PricingSection.heading')}</h2>
                <p className={`${styles.paragraph} text-center mb-24`}>{t('PricingSection.desc')}</p>
                <div
                    className={clsx(
                        "flex justify-center items-center flex-col gap-10 md:gap-0",
                        locale === "ar" ? "md:flex-row-reverse" : "md:flex-row"
                    )}>
                    {/* Pricing Card */}
                    <div className="relative overflow-hidden max-w-[400px] min-w-[300px] bg-white py-9 px-16 rounded-xl flex flex-col items-center justify-evenly gap-8">
                        <div className="text-center">
                            <p className="font-medium text-base uppercase dark:text-gray-800">Starting From</p>
                            <p className="text-primary text-2xl font-semibold">{t('PricingSection.firstPlan.cost')}</p>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-center text-[#637381]">
                            <p className="text-base font-normal">{t('PricingSection.firstPlan.features.first')}</p>
                            <p className="text-base font-normal">{t('PricingSection.firstPlan.features.second')}</p>
                            <p className="text-base font-normal">{t('PricingSection.firstPlan.features.third')}</p>
                            <p className="text-base font-normal">{t('PricingSection.firstPlan.features.fourth')}</p>
                            <p className="text-base font-normal">{t('PricingSection.firstPlan.features.fifth')}</p>
                            <p className="text-base font-normal">{t('PricingSection.firstPlan.features.sixth')}</p>
                        </div>
                        <button className="text-primary hover:opacity-70 text-base font-semibold border border-[#D4DEFF] rounded-3xl px-6 py-2">{t('PricingSection.purchase')}</button>
                        <Image
                            src={ovalPrimary}
                            alt="oval"
                            width={40}
                            height={40}
                            className="absolute bottom-0 -left-2"
                        />
                    </div>

                    {/* Pricing Card */}
                    <div className="relative overflow-hidden scale-105 z-10 max-w-[400px] min-w-[300px] bg-gradient-to-t from-[#8870EE] to-primary py-9 px-14 rounded-xl flex flex-col items-center justify-evenly gap-8">
                        <div className="flex flex-col items-center text-center text-white">
                            <span className="bg-white w-max px-4 py-2 uppercase mb-5 rounded-3xl text-primary font-semibold text-sm">Popular</span>
                            <p className="font-medium text-base uppercase">Starting From</p>
                            <p className="text-2xl font-semibold">{t('PricingSection.secondPlan.cost')}</p>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-center text-white">
                            <p className="text-base font-normal">{t('PricingSection.secondPlan.features.first')}</p>
                            <p className="text-base font-normal">{t('PricingSection.secondPlan.features.second')}</p>
                            <p className="text-base font-normal">{t('PricingSection.secondPlan.features.third')}</p>
                            <p className="text-base font-normal">{t('PricingSection.secondPlan.features.fourth')}</p>
                            <p className="text-base font-normal">{t('PricingSection.secondPlan.features.fifth')}</p>
                            <p className="text-base font-normal">{t('PricingSection.secondPlan.features.sixth')}</p>
                        </div>
                        <button className="text-primary hover:text-opacity-70 bg-white text-base font-semibold border border-[#D4DEFF] rounded-3xl px-6 py-2">{t('PricingSection.purchase')}</button>
                        <Image
                            src={priceTop}
                            alt="oval"
                            width={80}
                            height={80}
                            className="absolute top-0 -right-2"
                        />
                        <Image
                            src={priceBottom}
                            alt="oval"
                            width={80}
                            height={80}
                            className="absolute scale-75 -bottom-16 -left-5"
                        />
                    </div>

                    {/* Pricing Card */}
                    <div className="relative overflow-hidden max-w-[400px] min-w-[300px] bg-white py-9 px-16 rounded-xl flex flex-col items-center justify-evenly gap-8">
                        <div className="text-center">
                            <p className="font-medium text-base uppercase dark:text-gray-800">Starting From</p>
                            <p className="text-primary text-2xl font-semibold">{t('PricingSection.thirdPlan.cost')}</p>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-center text-[#637381]">
                            <p className="text-base font-normal">{t('PricingSection.thirdPlan.features.first')}</p>
                            <p className="text-base font-normal">{t('PricingSection.thirdPlan.features.second')}</p>
                            <p className="text-base font-normal">{t('PricingSection.thirdPlan.features.third')}</p>
                            <p className="text-base font-normal">{t('PricingSection.thirdPlan.features.fourth')}</p>
                            <p className="text-base font-normal">{t('PricingSection.thirdPlan.features.fifth')}</p>
                            <p className="text-base font-normal">{t('PricingSection.thirdPlan.features.sixth')}</p>
                        </div>
                        <button className="text-primary hover:opacity-70 text-base font-semibold border border-[#D4DEFF] rounded-3xl px-6 py-2">{t('PricingSection.purchase')}</button>
                        <Image
                            src={ovalSecondary}
                            alt="oval"
                            width={40}
                            height={40}
                            className="absolute top-0 -right-2"
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Pricing