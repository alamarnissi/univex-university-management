/**
 * Description: Google Cloud Storage Service
 * Ressource: https://github.com/drnguyenn/minasan/blob/main/server/src/core/Services/cloud-storage.service.ts
 * Author: Ala Marnissi
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const BUNNY_STREAM_API_HOST = "video.bunnycdn.com";

@Injectable()
export class BunnyCDNStorageService {
    private libraryId: string;
    private apiKey: string;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.libraryId = this.configService.get('BUNNYCDN_STREAM_LIBRARY_ID');
        this.apiKey = this.configService.get('BUNNYCDN_STREAM_API_KEY');
    }

    /**
     * This is the first step to start uploading video to bunnycdn
     * @param video_title title of the video to be uploaded
     * @description this will prepare the video to be uploaded in bunnycdn stream
     * @returns {}
     */
    async createVideo(video_title: string): Promise<any> {

        const uploadFileUrl = new URL(
            `/library/${this.libraryId}/videos`,
            `https://${BUNNY_STREAM_API_HOST}`,
        );

        const res = await fetch(uploadFileUrl, {
            method: "POST",
            headers: {
                AccessKey: this.apiKey as string,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: video_title }),
        });

        const response = await res.json();

        return response.guid;
    }

    async uploadVideo(uploadedFile: Buffer, path: string): Promise<any> {
        const video_id = await this.createVideo(path); 

        const uploadFileUrl = new URL(
            `/library/${this.libraryId}/videos/${video_id}`,
            `https://${BUNNY_STREAM_API_HOST}`,
        );

        const res = await fetch(uploadFileUrl, {
            method: "PUT",
            headers: {
                AccessKey: this.apiKey as string,
                "Content-Type": "application/octet-stream",
            },
            body: uploadedFile,
        });

        const response = await res.json();

        return {...response, path: video_id};
    }

    /**
     * @description this will update the video details in bunnycdn
     * @returns {}
     */
    async updateVideo(video_id: string, video_title: string): Promise<any> {

        const uploadFileUrl = new URL(
            `/library/${this.libraryId}/videos/${video_id}`,
            `https://${BUNNY_STREAM_API_HOST}`,
        );

        const res = await fetch(uploadFileUrl, {
            method: "POST",
            headers: {
                AccessKey: this.apiKey as string,
                accept: 'application/json',
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: video_title }),
        });

        const response = await res.json();

        return response;
    }

    async removeVideo(video_id: string) {
        const uploadFileUrl = new URL(
            `/library/${this.libraryId}/videos/${video_id}`,
            `https://${BUNNY_STREAM_API_HOST}`,
        );

        const res = await fetch(uploadFileUrl, {
            method: "DELETE",
            headers: {
                AccessKey: this.apiKey as string,
                accept: 'application/json',
            },
        });

        const response = await res.json();

        return response;
    }

}