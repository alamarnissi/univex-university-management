import React from 'react'

interface IconProps {
    width: number
    height: number
    color: string
}

type IconType = (props: IconProps) => JSX.Element;

interface StepperProps {
    steps: [{
        stepOrder: number,
        isActive: boolean,
        icon?: IconType,
        title?: string[]
    }]
    activeStepBg?: string,
}

const Stepper = ({ activeStep }: { activeStep: "first" | "second" | "third" }) => {
    
    return (
        <div className='w-full ml-6 pr-6'>

        <div className="w-full relative flex items-center justify-between">
            <div className="absolute left-0 top-2/4 h-0.5 w-full -translate-y-2/4 bg-gray-200"></div>
            <div className="absolute left-0 top-2/4 h-0.5 -translate-y-2/4 bg-blue-500 transition-all duration-500 w-0"></div>
            <div className={`${activeStep ? `bg-primary text-white` : ``} relative z-10 grid place-items-center w-8 h-8 rounded-full font-bold transition-all duration-300`}>
                <span className='font-semibold leading-none'>1</span>
                <div className="absolute -bottom-[1.76rem] w-max text-center">
                    <h6 className={`${activeStep ? `text-black` : ``} block antialiased tracking-normal font-sans text-sm font-semibold leading-relaxed dark:text-white`}>Basic Informations</h6>
                </div>
            </div>
            <div className={`${activeStep === "second" || activeStep === "third" ? `bg-primary text-white` : `bg-white border border-primary text-primary`} relative z-10 grid place-items-center w-8 h-8 rounded-full font-bold transition-all duration-300`}>
                <span className='font-semibold leading-none'>2</span>
                <div className="absolute -bottom-[1.76rem] w-max text-center">
                    <h6 className={`${activeStep === "second" || activeStep === "third" ? `text-black` : `text-gray-400`} block antialiased tracking-normal font-sans text-sm font-semibold leading-relaxed dark:text-white`}>Access Course</h6>
                </div>
            </div>
            <div className={`${activeStep === "third" ? `bg-primary text-white` : `bg-white border border-primary text-primary`} relative z-10 grid place-items-center w-8 h-8 rounded-full font-bold transition-all duration-300`}>
                <span className='font-semibold leading-none'>3</span>
                <div className="absolute -bottom-[1.76rem] w-max text-center">
                    <h6 className={`${activeStep === "third" ? `text-black` : `text-gray-400`} block antialiased tracking-normal font-sans text-sm font-semibold leading-relaxed dark:text-white`}>Media</h6>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Stepper