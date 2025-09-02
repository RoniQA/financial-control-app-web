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
exports.CreateInvoiceDto = exports.CreateInvoiceItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateInvoiceItemDto {
}
exports.CreateInvoiceItemDto = CreateInvoiceItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'product-id' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25.50 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "discount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "tax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 51.00 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '5102', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "cfop", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '8414.10.00', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "ncm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '28.038.00', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "cest", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '101', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "csosn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 18, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "icms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1.65, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "pis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7.6, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "cofins", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "ipi", void 0);
class CreateInvoiceDto {
}
exports.CreateInvoiceDto = CreateInvoiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NF-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'OUTBOUND', enum: ['INBOUND', 'OUTBOUND'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DRAFT', enum: ['DRAFT', 'SENT', 'PAID', 'CANCELLED'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'partner-id', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "partnerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-id' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'order-id', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100.00, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "tax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-31', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Observações da nota', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CreateInvoiceItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateInvoiceItemDto),
    __metadata("design:type", Array)
], CreateInvoiceDto.prototype, "items", void 0);
//# sourceMappingURL=create-invoice.dto.js.map