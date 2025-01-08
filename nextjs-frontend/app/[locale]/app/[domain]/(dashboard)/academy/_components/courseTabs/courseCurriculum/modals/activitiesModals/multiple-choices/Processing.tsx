import Image from "next/image"
import ProcessingImg from "../../../icons/processing.png"

const Processing = () => {
  return (
    <div className=" absolute left-0 top-0 z-0 w-full h-full flex flex-col items-center justify-center bg-white">
        <Image
            src={ProcessingImg}
            alt="processing"
            width={500}
            height={500}
        />
        <span className="text-lg font-bold text-gray-700 -mt-10">We are generating your activity , please wait !</span>
    </div>
  )
}

export default Processing