"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Minio = require("minio");
let FileService = class FileService {
    constructor(configService) {
        this.configService = configService;
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get('MINIO_ENDPOINT', 'localhost'),
            port: parseInt(this.configService.get('MINIO_PORT', '9000')),
            useSSL: false,
            accessKey: this.configService.get('MINIO_ACCESS_KEY', 'nova_agro'),
            secretKey: this.configService.get('MINIO_SECRET_KEY', 'nova_agro_2024'),
        });
    }
    async uploadFile(bucketName, fileName, fileBuffer) {
        try {
            const bucketExists = await this.minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                await this.minioClient.makeBucket(bucketName, 'us-east-1');
            }
            await this.minioClient.putObject(bucketName, fileName, fileBuffer);
            return `${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${bucketName}/${fileName}`;
        }
        catch (error) {
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }
    async deleteFile(bucketName, fileName) {
        try {
            await this.minioClient.removeObject(bucketName, fileName);
        }
        catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }
    async getFileUrl(bucketName, fileName) {
        try {
            return await this.minioClient.presignedGetObject(bucketName, fileName, 24 * 60 * 60);
        }
        catch (error) {
            throw new Error(`Failed to get file URL: ${error.message}`);
        }
    }
};
exports.FileService = FileService;
exports.FileService = FileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FileService);
//# sourceMappingURL=file.service.js.map