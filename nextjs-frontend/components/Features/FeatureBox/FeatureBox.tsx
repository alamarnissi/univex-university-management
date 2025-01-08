import Image, { StaticImageData } from "next/image"

type FeatureType = {
    image: StaticImageData,
    imgSize?: number,
    title: string,
    text: string
}

const FeatureBox = ({image, imgSize = 86, title, text}: FeatureType) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg flex-1 self-stretch min-width-[280px] text-white cursor-pointer">
        <div className="flex-1 min-h-[104px]">
            <Image
                src={image}
                alt="feature icon"
                width={imgSize}
                height={imgSize}    
            />
        </div>
        <div className="flex-1">
            <p className="font-bold text-lg sm:text-xl text-center xl:whitespace-nowrap mb-1">{title}</p>
            <p className="font-light text-base sm:text-lg text-center">{text}</p>
        </div>
    </div>
  )
}

export default FeatureBox