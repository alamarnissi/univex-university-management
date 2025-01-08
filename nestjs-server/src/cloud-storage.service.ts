/**
 * Description: Google Cloud Storage Service
 * Ressource: https://github.com/drnguyenn/minasan/blob/main/server/src/core/Services/cloud-storage.service.ts
 * Author: Ala Marnissi
 */

import { Bucket, Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from 'path';
import { File } from './utils/interfaces/file.interface';
import { ConfigService } from '@nestjs/config';
import slugify from 'slugify';


@Injectable()
export class CloudStorageService {
  private bucket: Bucket;
  private storage: Storage;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.storage = new Storage({
        projectId: this.configService.get('GCP_PROJECT_ID'),
        credentials: {
            client_email: this.configService.get('GCS_CLIENT_EMAIL'),
            private_key: this.configService.get('GCS_PRIVATE_KEY').replace(/\\n/g, '\n'),
        },
    });
    this.bucket = this.storage.bucket(this.configService.get('GCS_BUCKET_NAME'));
  }

  private setDestination(destination: string): string {
    let escDestination = '';
    escDestination += destination.replace(/^\.+/g, '').replace(/^\/+|\/+$/g, '');
    if (escDestination !== '') escDestination = escDestination + '/';
    return escDestination;
  }

  private setFilename(uploadedFile: File, filename?: string): string {
    const fileName = parse(uploadedFile.originalname);
    const name = filename ? filename : fileName.name;
    return `${slugify(name, { lower: true })}-${Date.now()}${fileName.ext}`.replace(/^\.+/g, '').replace(/^\/+/g, '').replace(/\r|\n/g, '_');
  }

  async uploadFile(uploadedFile: File, destination: string, filename?: string, filetype?: string): Promise<any> {
    let name = "";
    if (filename && filetype) {
      name = this.setFilename(uploadedFile, `${filetype}-${filename}`);
    }else {
      name = this.setFilename(uploadedFile);
    }
    
    const fileName = this.setDestination(destination) + name;
    const file = this.bucket.file(fileName);
    try {
      await file.save(uploadedFile.buffer, { contentType: uploadedFile.mimetype });
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
    return { ...file.metadata, publicUrl: `https://storage.googleapis.com/${this.bucket.name}/${file.name}`, fileName: file.name };
  }

  async removeFile(fileName: string): Promise<void> {
    const file = this.bucket.file(fileName);
    try {
      await file.delete();
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}