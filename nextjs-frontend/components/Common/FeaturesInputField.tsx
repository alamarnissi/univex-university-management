import { Check, PlusSquare, X } from 'lucide-react';
import { useState } from 'react'

type FeaturesFieldProps = {
    name: string,
    isEditable?: boolean
}

type Props = {
    handleChange: (features: string[]) => void, 
    placeholder?: string
}

const FeaturesInputField = ({handleChange, placeholder}: Props) => {
    const [input, setInput] = useState('');
    const [features, setFeatures] = useState<FeaturesFieldProps[]>([
        { name: '', isEditable: true }
    ]);

    const addInputField = () => {
        /* check features does not have empty fields */
        if (features.filter(feature => feature.name === "").length > 0) return
        
        setFeatures(prevState => [...prevState, { name: '', isEditable: true }])
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setInput(value);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        const { key } = e;
        const trimmedInput = input.trim();
        let featuresNames = features.map(feature => feature.name)

        if ((key === ',' || key === 'Enter') && trimmedInput.length && !featuresNames.includes(trimmedInput)) {
            e.preventDefault();
            setFeatures(prevState => [...prevState, { name: trimmedInput, isEditable: false }]);
            setFeatures(prevState => prevState.filter(feature => feature.name !== ""));

            handleChange([...featuresNames, trimmedInput])
            setInput('');
        }

        if (key === "Backspace" && !input.length) {
            setFeatures(prevState => prevState.filter(feature => feature.name !== ""));
            handleChange(featuresNames)
        }
    };

    const deleteFeature = (index: number) => {
        setFeatures(prevState => prevState.filter((feature, i) => i !== index))
        handleChange(features.filter((feature, i) => i !== index).map(feature => feature.name))
    }

    const addFeature = () => {
        const trimmedInput = input.trim();
        let featuresNames = features.map(feature => feature.name);

        if (trimmedInput.length && !featuresNames.includes(trimmedInput)) {
            setFeatures(prevState => [...prevState, { name: trimmedInput, isEditable: false }]);
            setFeatures(prevState => prevState.filter(feature => feature.name !== ""));

            handleChange([...featuresNames, trimmedInput])
            setInput('');
        }
    }

    return (
        <div className="flex overflow-hidden overflow-y-scroll no-scrollbar w-full max-w-[600px] flex-wrap min-h-[55px] bg-[#F8F9FC] pl-3.5 py-1 border border-dashed border-gray-600 rounded-lg">
            <div className='flex flex-col w-5/6'>
                {features.map((feature, index) => (
                    <div key={index}>
                        {feature.isEditable ?
                            <div className='flex items-center justify-between ml-0 mr-3 py-0 pl-1.5 pr-2.5'>
                                <input
                                    value={input}
                                    placeholder={placeholder || "Enter a skill"}
                                    onKeyDown={onKeyDown}
                                    onChange={onChange}
                                    className='h-fit w-full bg-[#F8F9FC] text-black font-medium text-[15px] border-none rounded-md p-3.5 focus-visible:border-0 focus-within:ring-0 focus-visible:outline-none'
                                />
                                <div className='flex items-center justify-center'>
                                    <button
                                        className='flex p-1.5 text-lg text-black border-none cursor-pointer rounded-lg hover:bg-gray-100'
                                        onClick={() => addFeature()}
                                    >
                                        <Check size={14} className='cursor-pointer text-[#514AA5]' />
                                    </button>
                                    <button
                                        className='flex p-1.5 text-lg text-black border-none cursor-pointer rounded-lg hover:bg-gray-100'
                                        onClick={() => deleteFeature(index)}
                                    >
                                        <X size={14} className='cursor-pointer text-[#514AA5]' />
                                    </button>
                                </div>
                            </div>
                            :

                            <div className="flex text-black font-medium text-[15px] justify-between items-center h-fit my-2 ml-0 mr-3 py-1.5 pl-4 pr-2.5 border border-[#F5EAEF] rounded-lg bg-[#F5EAEF]">
                                {feature.name}
                                <button
                                    className='flex p-1.5 text-lg text-black border-none cursor-pointer rounded-lg hover:bg-[#F5EAEF]/90'
                                    onClick={() => deleteFeature(index)}
                                >
                                    <X size={14} className='cursor-pointer text-[#514AA5]' />
                                </button>
                            </div>
                        }
                    </div>
                ))}
            </div>
            <div className='w-1/6 flex items-end justify-end p-2'>
                <button>
                    <PlusSquare size={30} className='cursor-pointer text-[#514AA5]' onClick={addInputField} />
                </button>
            </div>
        </div>
    )
}

export default FeaturesInputField