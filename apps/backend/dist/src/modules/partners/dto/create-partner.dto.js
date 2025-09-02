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
exports.CreatePartnerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePartnerDto {
}
exports.CreatePartnerDto = CreatePartnerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CUSTOMER', enum: ['CUSTOMER', 'SUPPLIER', 'BOTH'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'João Silva' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123.456.789-00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "document", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123456789', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "ie", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123456', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "im", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'joao@email.com', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '(11) 99999-9999', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            street: 'Rua das Flores, 123',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567'
        },
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreatePartnerDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePartnerDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'company-id' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "companyId", void 0);
//# sourceMappingURL=create-partner.dto.js.map