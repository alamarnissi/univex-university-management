import styles from "@/lib/styles"
import Image from "next/image"

// images
import userImg from "./assets/avatarr.png"
import shapeIcon from "./assets/shape_testim.svg"
import ovalIcon from "./assets/oval_testim.svg"
import dotsIcon from "./assets/dots_testim.svg"

const Testimonials = () => {
  return (
    <div id="testimonials" className={`${styles.padding} ${styles.flexStart} bg-[#F9F9F9] relative my-10`}>
        <div className={`${styles.boxWidth}`}>
            <div className="flex items-center justify-center relative z-4">
                <div className="relative bg-white rounded-xl flex flex-col md:flex-row gap-8 py-10 px-12 z-4">
                    <div className="relative flex justify-center items-center px-4 pt-2 md:pt-6 pb-2 md:pb-8">
                        <Image 
                            src={userImg}
                            alt="testimonial - avatar"
                            width={162}
                            height={165}
                            className="relative text-center z-10"
                        />
                        
                    </div>
                    <div className="flex flex-col justify-center gap-5">
                        <p className="text-[#637381] text-base leading-[25px] max-w-[480px]">Our educational platform is the result of the collaboration and the instruction of our educational team, our developers and our UI/UX designer.
                            Its various functionalities allow it to accommodate  the needs of the entire educational ecosystem.
                        </p>
                        <div className="text-start">
                            <p className="text-primary text-lg font-bold leading-[25px]">avatar Halleb</p>
                            <p className="text-[#A6A6A6] text-sm font-normal">Founder</p>
                        </div>
                    </div>
                    <Image 
                        src={dotsIcon}
                        alt="dots"
                        width={68}
                        height={68} 
                        className="absolute -left-5 -bottom-5 z-1"
                    />
                    <Image
                        src={ovalIcon}
                        alt="oval"
                        width={30}
                        height={39}
                        className="absolute z-1 top-4 -right-4"
                    />
                    <Image
                        src={shapeIcon}
                        alt="shape"
                        width={56}
                        height={64}
                        className="absolute z-1 -top-4 -right-4"
                    />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Testimonials