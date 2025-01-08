import { useFilesUploadStore } from '@/stores/useGlobalStore';
import { useModalStore } from '@/stores/useModalsStore';
import { Trash2 } from 'lucide-react';
import { useState } from 'react'
import { useToast } from '../ui/toast/use-toast';

type File = {
    name: string,
    size: number
}
const FilesInputField = ({ maxFiles, acceptTypes }: { maxFiles?: number, acceptTypes?: string }) => {
    const { toast } = useToast();
    const { previewFileState, setFileState, setMultiFilesState } = useFilesUploadStore();
    const { modalTypeState } = useModalStore()

    const previewFilePath = (previewFileState !== null && modalTypeState !== "Video") ? 
    `${process.env.NEXT_PUBLIC_GCS_URL}${process.env.NEXT_PUBLIC_GCS_BUCKET_NAME}/${previewFileState}` 
    : 
    `${process.env.NEXT_PUBLIC_BUNNYCDN_PLAYER_EMBED}/${process.env.NEXT_PUBLIC_BUNNYCDN_STREAM_LIBRARY_ID}/${previewFileState}`
    
    const [files, setFiles] = useState<(File)[]>([]);
    const [preview, setPreview] = useState<string>(previewFilePath || '');
    const [videoFile, setVideoFile] = useState<Blob | MediaSource | null>();
    const [dropzoneVisible, setDropzoneVisible] = useState(true);
    const [dragging, setDragging] = useState<boolean>(false);

    const handleFileUpload = (uploadedFiles: FileList) => {
        const newFiles = Array.from(uploadedFiles).map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            // Add more properties as needed
        }));
        setFiles([...files, ...newFiles]);
        // setMultiFilesState([...files, ...newFiles]);

        if (maxFiles) {
            if (files.length + newFiles.length >= maxFiles) {
                setDropzoneVisible(false);
            }

            if (maxFiles === 1) {
                // Access the first uploaded file object (assuming single file upload)
                const uploadedFile = uploadedFiles[0];

                // Check if the uploaded file is a video
                if (uploadedFile.type.startsWith('video/')) {
                    // Set the video file state
                    setVideoFile(uploadedFile);
                }

                setFileState(uploadedFile);
            }
        }
    };

    const handleDeleteFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        setVideoFile(null);

        if (maxFiles) {
            if (!dropzoneVisible && updatedFiles.length < maxFiles) {
                setDropzoneVisible(true);
            }
        }
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer.files;
        const fileType = file[0].type;

        if (modalTypeState === "Video" && !fileType.startsWith('video/')) {
            toast({ variant: "destructive", description: "Please select a video file" });
            return;
        }
        if (modalTypeState === "Doc_Presentation" && !fileType.match('application/pdf|application/msword|.doc|.docx|.csv')) {
            toast({ variant: "destructive", description: "Please select a document file" });
            return;
        }
        handleFileUpload(file as FileList);
    };

    return (
        <>
            <div className='flex flex-col gap-2 mb-3'>
                {files.map((file, index) => (
                    <div key={index} className='flex items-center justify-between bg-[#E1E0F4] px-4 py-3 rounded-md'>
                        <div className='flex items-center justify-center gap-3'>
                            <p className='rounded-full py-0.5 px-1.5 text-xs text-[#6A5AE0] font-bold border-2 border-[#6A5AE0] h-fit'>{index + 1}</p>
                            <p className='text-[15px] font-semibold'>{file.name}</p>
                        </div>
                        <div className='flex items-center justify-center gap-2'>
                            {/* preview icon */}
                            {/* {!(file as any).type.startsWith('video/') && (
                                <button
                                    className='flex p-1.5 border-none cursor-pointer rounded-lg hover:bg-[#514AA5]/20'
                                    onClick={() => { }}
                                >
                                    <Eye size={18} className='cursor-pointer text-[#1E0D66]' />
                                </button>
                            )} */}
                            
                            <button
                                type='button'
                                className='flex p-1.5 border-none cursor-pointer rounded-lg hover:bg-[#514AA5]/20'
                                onClick={() => { setFileState(null) }}
                            >
                                <Trash2 size={18} className='cursor-pointer text-[#D03535]' onClick={() => handleDeleteFile(index)} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {dropzoneVisible &&
                <div
                    className="flex items-center justify-center w-full"
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            accept={acceptTypes ? acceptTypes : "image/*, application/pdf, application/msword, .doc,.docx"}
                            onChange={(e) => handleFileUpload(e.target.files as FileList)}
                        />
                    </label>
                </div>
            }

            {/* Preview the uploaded doc */}
            {(preview !== "" && previewFileState) && (
                <div className={`${videoFile ? "hidden" : ""} mt-4`}>
                    <p className="flex items-center mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                        Preview
                    </p>
                    <iframe
                        src={`${decodeURIComponent(preview)}#toolbar=1`}
                        width="520"
                        height="350"
                        title="Document Preview"
                    ></iframe>
                </div>
            )}

            {/* Preview the uploaded video */}
            {videoFile && (
                <div className="mt-4">
                    <p className="flex items-center mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                        Preview
                    </p>
                    <video controls width="100%">
                        <source src={URL.createObjectURL(videoFile)} type={(videoFile as Blob).type} />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
        </>
    )
}

export default FilesInputField