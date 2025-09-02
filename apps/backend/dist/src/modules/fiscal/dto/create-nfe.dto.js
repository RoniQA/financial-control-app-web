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
exports.CreateNfeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateNfeDto {
}
exports.CreateNfeDto = CreateNfeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '000001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNfeDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNfeDto.prototype, "series", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '35200114200166000187550010000000015123456789' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNfeDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DRAFT', enum: ['DRAFT', 'SENT', 'AUTHORIZED', 'DENIED', 'CANCELLED'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNfeDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'company-id' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNfeDto.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '<xml>...</xml>', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNfeDto.prototype, "xmlContent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://danfe-url.com', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNfeDto.prototype, "danfeUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '135240000000000', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNfeDto.prototype, "protocol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Erro na validação', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNfeDto.prototype, "error", void 0);
//# sourceMappingURL=create-nfe.dto.js.map