import Image, { StaticImageData } from "next/image"
import checkIcon from "../check.svg";

type CardType = {
    image: StaticImageData,
    title: string,
    list: Array<string>
}

const CardSection = ({ image, title, list }: CardType) => {
    return (
        <div className="rounded-lg shadow-md flex-1 self-stretch min-width-[280px] cursor-pointer" id="helpCard">
            <div className="relative w-full h-[147px] overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="100vw"
                    style={{
                        objectFit: 'cover',
                    }}
                    className="transition ease-in helpImg"
                />
            </div>
            <div className="pt-4 pb-4 px-2 flex flex-col justify-center" >
                <p className="text-base dark:text-gray-950 font-bold text-center mb-4 px-2 flex-1 min-h-[70px]">{title}</p>
                <div className="flex flex-col justify-center flex-1">
                    {list && list.map((el, i) => (
                        <div key={i} className="flex items-start justify-start gap-2 mb-3 px-2 ">
                            <Image src={checkIcon} alt="check icon" className="mt-[4px]" width={14} height={14} />
                            <p className="text-sm text-[#637381]">{el}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CardSection