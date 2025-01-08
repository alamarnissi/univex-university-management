import Image from "next/image"

type BoxElements = {
    image: string,
    imgBg?: string,
    imgSize?: number,
    title: string,
    text: string,
    buttonText?: string,
    buttonBg?: string
}

const BoxSection = ({ image, imgBg, imgSize = 48, title, text, buttonText, buttonBg }: BoxElements) => {
    return (
        <div className="w-fit backdrop-blur-sm bg-transparent bg-white bg-opacity-50 px-4 py-4 rounded-lg">
            <div className="flex gap-3 items-center justify-center">
                <div className={`flex justify-center items-center ${imgBg && `${imgBg} p-3 rounded-lg`}`}>
                    <Image
                        src={image}
                        alt="box image"
                        width={imgSize}
                        height={imgSize}
                        sizes="100vw"
                        style={{
                            width: 'auto',
                            objectFit: "cover"
                        }}
                    />
                </div>
                <div className="flex flex-col items-start gap-1">
                    <p className="text-base font-semibold text-black">{title}</p>
                    <p className="text-sm font-light text-[#212B36]">{text}</p>
                </div>
            </div>
            {buttonText &&
                <div className="flex justify-center items-center w-full mt-3">
                    <button className={`w-fit px-7 rounded-3xl text-white py-2 text-sm font-medium ${buttonBg ? buttonBg : 'bg-secondary'}`}>{buttonText}</button>
                </div>
            }
        </div>
    )
}

export default BoxSection