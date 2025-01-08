import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle, { TextStyleOptions } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Code, Heading1, Heading2, Heading3, Heading4, Heading5, ListIcon, ListOrdered, Minus, Pilcrow, Quote, Redo, Undo } from 'lucide-react';
import { useRef, useState } from 'react';
import AlignIcon from '../Common/assets/AlignIcon';
import BoldIcon from '../Common/assets/BoldIcon';
import HeadingIcon from '../Common/assets/HeadingIcon';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import ColorPickerIcon from '../Common/assets/ColorPickerIcon';
import { useTiptapEditorStore } from '@/stores/useGlobalStore';

// define your extension array
const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] } as Partial<TextStyleOptions>),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',

    }),
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
            HTMLAttributes: {
                class: 'list-disc',
            }
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
            HTMLAttributes: {
                class: 'list-decimal',
            }
        },
    }),
    Placeholder.configure({
        placeholder: 'This is the project description , you can add anything you want !!',
    }),
]

const content = ``;

const Tiptap = (
    { 
        reference = null,
        editorState = null,
        handleEditorState = null,
        orderedList = false,
        bulletList = false,
        code = false,
        horizontalRule = false,
        quote = false
    }:
        {
            reference?: any,
            editorState?: any,
            handleEditorState?: any,
            orderedList?: boolean,
            bulletList?: boolean,
            code?: boolean,
            horizontalRule?: boolean,
            quote?: boolean
        }
) => {
    const [openHeading, setOpenHeading] = useState(false);
    const [openAlignement, setOpenAlignement] = useState(false);

    // const { editorState, setEditorState } = useTiptapEditorStore();

    const editorRef = useRef(reference);

    const editor: any = useEditor({
        extensions,
        content: editorState || content,
        onUpdate: ({ editor }) => {
            // check editor.getHTML() is empty
            if (editor.getHTML() !== '<p></p>') {
                handleEditorState(editor.getHTML()); 
            }
        }
    })

    if (!editor) return null

    return (
        <>
            <EditorContent
                ref={editorRef}
                editor={editor}
                className='bg-[#F8F9FC] min-h-[150px] p-5 rounded-t-xl border text-black border-[#E4E4E9] focus-visible:outline-none'
                aria-expanded={true}
                required
            />
            <div id="menubar" className='relative flex items-center justify-start gap-3 pl-5 py-2 text-black rounded-b-xl border border-[#E4E4E9]'>
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleBold()
                            .run()
                    }
                    className={`${editor.isActive('bold') ? 'is-active' : ''}`}
                >
                    <BoldIcon size={20} />
                </button>
                <Collapsible className='relative'>
                    <CollapsibleTrigger onClick={() => setOpenHeading(!openHeading)} className='flex items-center justify-center'>
                        <HeadingIcon />
                    </CollapsibleTrigger>
                    <CollapsibleContent className={`${openHeading ? 'flex' : 'hidden'} z-20 items-center justify-center gap-2 absolute -bottom-1.5 left-6 bg-white shadow-md transition-all rounded-lg py-1 px-2`}>
                        <button
                            onClick={() => editor.chain().focus().setParagraph().run()}
                            className={`${editor.isActive('paragraph') ? 'is-active' : ''}`}
                        >
                            <Pilcrow size={20} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={`${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
                        >
                            <Heading1 size={20} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
                        >
                            <Heading2 size={20} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={`${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
                        >
                            <Heading3 size={20} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                            className={`${editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}`}
                        >
                            <Heading4 size={20} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                            className={`${editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}`}
                        >
                            <Heading5 size={20} />
                        </button>
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible className='relative'>
                    <CollapsibleTrigger onClick={() => setOpenAlignement(!openAlignement)} className='flex items-center justify-center'>
                        <AlignIcon size={20} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className={`${openAlignement ? 'flex' : 'hidden'} z-20 items-center justify-center gap-2 absolute -bottom-1.5 left-6 bg-white shadow-md transition-all rounded-lg py-1 px-2`}>
                        <button
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
                        >
                            <AlignLeft size={20} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            className={editor.isActive({ textAlign: 'center' }) ? 'is-active text-center' : ''}
                        >
                            <AlignCenter size={20} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            className={editor.isActive({ textAlign: 'right' }) ? 'is-active text-right' : ''}
                        >
                            <AlignRight size={20} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                            className={editor.isActive({ textAlign: 'justify' }) ? 'is-active text-justify' : ''}
                        >
                            <AlignJustify size={20} />
                        </button>
                    </CollapsibleContent>
                </Collapsible>

                {bulletList &&
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'is-active' : ''}
                    >
                        <ListIcon size={20} />
                    </button>
                }
                {orderedList &&
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'is-active' : ''}
                    >
                        <ListOrdered size={20} />
                    </button>
                }
                {code &&
                    <button
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        disabled={
                            !editor.can()
                                .chain()
                                .focus()
                                .toggleCode()
                                .run()
                        }
                        className={editor.isActive('code') ? 'is-active' : ''}
                    >
                        <Code size={20} />
                    </button>
                }
                {quote &&
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={editor.isActive('blockquote') ? 'is-active' : ''}
                    >
                        <Quote size={20} />
                    </button>
                }
                {horizontalRule &&
                    <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                        <Minus size={20} />
                    </button>
                }

                <div className='relative flex'>
                <label htmlFor={`${reference}-color`} className='relative' ref={editorRef}>
                    <ColorPickerIcon size={20} />

                    <input
                        type="color"
                        id={`${reference}-color`}
                        onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                        value={editor.getAttributes(TextStyle).color}
                        className='invisible opacity-0 w-0 absolute bottom-0'
                        data-testid="setColor"
                    />
                </label>

                </div>

                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .undo()
                            .run()
                    }
                >
                    <Undo size={20} />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .redo()
                            .run()
                    }
                >
                    <Redo size={20} />
                </button>
            </div>
        </>
    )
}

export default Tiptap