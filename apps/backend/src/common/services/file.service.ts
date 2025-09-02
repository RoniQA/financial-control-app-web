import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class FileService {
  private minioClient: Minio.Client;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: parseInt(this.configService.get<string>('MINIO_PORT', '9000')),
      useSSL: false,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY', 'nova_agro'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY', 'nova_agro_2024'),
    });
  }

  async uploadFile(bucketName: string, fileName: string, fileBuffer: Buffer): Promise<string> {
    try {
      // Ensure bucket exists
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
      }

      // Upload file
      await this.minioClient.putObject(bucketName, fileName, fileBuffer);
      
      // Return file URL
      return `${this.configService.get<string>('MINIO_ENDPOINT')}:${this.configService.get<string>('MINIO_PORT')}/${bucketName}/${fileName}`;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(bucketName: string, fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(bucketName, fileName);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async getFileUrl(bucketName: string, fileName: string): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(bucketName, fileName, 24 * 60 * 60); // 24 hours
    } catch (error) {
      throw new Error(`Failed to get file URL: ${error.message}`);
    }
  }
}

