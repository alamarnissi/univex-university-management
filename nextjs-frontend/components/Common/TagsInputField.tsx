import { X } from 'lucide-react';
import React, { useState } from 'react'

interface Props {
    placeholder?: string
    height?: string
    handleChange: (tags: string[]) => void
    tagList: string[]
}

const TagsInputField = ({placeholder = "Enter a keyword", height= "110", handleChange, tagList}: Props) => {
    const [input, setInput] = useState('');
    const [tags, setTags] = useState<string[]>(tagList ?? []);
    const [isKeyReleased, setIsKeyReleased] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setInput(value);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        const { key } = e;
        const trimmedInput = input.trim() as string;

        if ((key === ',' || key === 'Enter') && trimmedInput.length && !tags.includes(trimmedInput)) {
            e.preventDefault();
            setTags(prevState => [...prevState, trimmedInput]);
            handleChange([...tags, trimmedInput]);
            setInput('');
        }

        if (key === "Backspace" && !input.length && tags.length && isKeyReleased) {
            const tagsCopy = [...tags];
            const poppedTag = tagsCopy.pop() as string;
            e.preventDefault();

            handleChange(tagsCopy);
            setTags(tagsCopy);
            setInput(poppedTag);
        }

        setIsKeyReleased(false);
    };

    const onKeyUp = () => {
        setIsKeyReleased(true);
    }

    const deleteTag = (index: number) => {
        setTags(prevState => prevState.filter((tag, i) => i !== index))
        handleChange(tags.filter((tag, i) => i !== index))
    }

    return (
        <div className={`flex overflow-hidden overflow-y-scroll no-scrollbar w-full max-w-[600px] flex-wrap min-h-[${height}px] h-max bg-[#F8F9FC] pl-3.5 border border-dashed border-gray-600 rounded-lg`}>
            {tags.map((tag, index) => (
                <div key={index} className="flex font-medium text-[15px] items-center h-fit my-2 ml-0 mr-3 py-0 pl-3 pr-1.5 border border-[#514AA5] rounded-lg bg-[#514AA5] whitespace-pre-wrap text-white">
                    {tag}
                    <button 
                        className='flex p-1.5 border-none cursor-pointer rounded-lg hover:bg-[#514AA5]/90'
                        onClick={() => deleteTag(index)}
                    >
                        <X size={14} className='cursor-pointer text-white' />
                    </button>
                </div>
            ))}
            <input
                value={input}
                placeholder={placeholder}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                onChange={onChange}
                className='bg-[#F8F9FC] w-[150px] h-fit text-black font-medium text-[15px] border-none rounded-md py-3 pl-3.5 focus-visible:border-0 focus-within:ring-0 focus-visible:outline-none'
            />
        </div>
    )
}

export default TagsInputField