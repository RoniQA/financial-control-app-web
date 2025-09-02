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
exports.CreateStockMoveDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateStockMoveDto {
}
exports.CreateStockMoveDto = CreateStockMoveDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'IN', enum: ['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStockMoveDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'product-id' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStockMoveDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'warehouse-id' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStockMoveDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateStockMoveDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25.50, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateStockMoveDto.prototype, "unitCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 255.00, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateStockMoveDto.prototype, "totalCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PO-001', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStockMoveDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'order-id', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStockMoveDto.prototype, "referenceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'LOTE-2024-001', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStockMoveDto.prototype, "batch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SN-123456', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStockMoveDto.prototype, "serial", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Entrada por compra', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStockMoveDto.prototype, "reason", void 0);
//# sourceMappingURL=create-stock-move.dto.js.map