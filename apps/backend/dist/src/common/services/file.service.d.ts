import { ConfigService } from '@nestjs/config';
export declare class FileService {
    private readonly configService;
    private minioClient;
    constructor(configService: ConfigService);
    uploadFile(bucketName: string, fileName: string, fileBuffer: Buffer): Promise<string>;
    deleteFile(bucketName: string, fileName: string): Promise<void>;
    getFileUrl(bucketName: string, fileName: string): Promise<string>;
}
