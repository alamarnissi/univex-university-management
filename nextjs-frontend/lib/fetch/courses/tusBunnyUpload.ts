import * as tus from 'tus-js-client';
import { slugify } from '@/lib/utils';
import { sha256 } from 'js-sha256';


const BUNNY_STREAM_API_HOST = "video.bunnycdn.com";
const BUNNY_STREAM_LIBRARY_ID = process.env.NEXT_PUBLIC_BUNNYCDN_STREAM_LIBRARY_ID;
const BUNNY_API_KEY = process.env.NEXT_PUBLIC_BUNNYCDN_API_KEY;

const createVideo = async (video_title: string): Promise<any> => {

    const uploadFileUrl = new URL(
        `/library/${BUNNY_STREAM_LIBRARY_ID}/videos`,
        `https://${BUNNY_STREAM_API_HOST}`,
    );

    const res = await fetch(uploadFileUrl, {
        method: "POST",
        headers: {
            AccessKey: BUNNY_API_KEY as string,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: video_title }),
    });

    const response = await res.json();

    return response.guid;
}

const getVideo = async (video_id: string): Promise<any> => {

    const uploadFileUrl = new URL(
        `/library/${BUNNY_STREAM_LIBRARY_ID}/videos/${video_id}`,
        `https://${BUNNY_STREAM_API_HOST}`,
    );

    const res = await fetch(uploadFileUrl, {
        method: "GET",
        headers: {
            AccessKey: BUNNY_API_KEY as string,
            "Content-Type": "application/json",
        }
    });

    const response = await res.json();

    return response.status;
}

const tusUploadVideo = async (file: Blob, filename: string, handleSetProgress?: any): Promise<any> => {

    return new Promise<string>(async (resolve, reject) => {

        // const data = await file.arrayBuffer();
        // const buffer = Buffer.from(data);

        const slugify_filename = slugify(filename);
        const path = slugify_filename + "-" + Date.now() + ".mp4";
        const video_id = await createVideo(path);

        let percentageValue = 0;

        const expiration_time = new Date().getTime() + 1000 * 60 * 60 * 24;
        // Create a new tus upload
        let upload = new tus.Upload(file, {
            endpoint: "https://video.bunnycdn.com/tusupload",
            retryDelays: [0, 3000, 5000, 10000, 20000, 60000, 60000],
            headers: {
                AuthorizationSignature: sha256(BUNNY_STREAM_LIBRARY_ID! + BUNNY_API_KEY! + expiration_time + video_id), // SHA256 signature (library_id + api_key + expiration_time + video_id)
                AuthorizationExpire: expiration_time.toString(), // Expiration time as in the signature,
                VideoId: video_id, // The guid of a previously created video object through the Create Video API call
                LibraryId: BUNNY_STREAM_LIBRARY_ID!,
            },
            metadata: {
                filetype: file.type,
                title: path,
            },
            onError: function (error) {
                console.log(error);
                reject(error);
            },
            onProgress: async function (bytesUploaded, bytesTotal) {
                let percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);

                percentageValue = Math.round(Number(percentage));

                if (handleSetProgress) {
                    handleSetProgress(percentageValue);
                }
            },
            onSuccess: function () {
                resolve(video_id);
            }
        })

        // Check if there are any previous uploads to continue.
        upload.findPreviousUploads().then(function (previousUploads) {
            // Found previous uploads so we select the first one. 
            if (previousUploads.length) {
                upload.resumeFromPreviousUpload(previousUploads[0])
            }

            // Start the upload
            upload.start()
        })

    });
}

export const uploadToBunny = async (file: Blob, filename: string, handleSetProgress?: any) => {
    const video_id = await tusUploadVideo(file, filename, handleSetProgress);

    if (video_id) {
        const video_status = await getVideo(video_id);

        return { path: video_id, video_status };
    }
}