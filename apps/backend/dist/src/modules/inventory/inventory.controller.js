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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inventory_service_1 = require("./inventory.service");
const create_stock_move_dto_1 = require("./dto/create-stock-move.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async createStockMove(createStockMoveDto) {
        return this.inventoryService.createStockMove(createStockMoveDto);
    }
    async getStockMoves(productId, warehouseId) {
        return this.inventoryService.getStockMoves(productId, warehouseId);
    }
    async getStockSummary() {
        const companyId = 'cmf1uv2gc0000z0axy1xdrony';
        return this.inventoryService.getStockSummary(companyId);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)('stock-moves'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar movimentação de estoque' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Movimentação criada com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_stock_move_dto_1.CreateStockMoveDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "createStockMove", null);
__decorate([
    (0, common_1.Get)('stock-moves'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar movimentações de estoque' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de movimentações' }),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, common_1.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getStockMoves", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Resumo do estoque' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Resumo do estoque' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getStockSummary", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('Inventory'),
    (0, common_1.Controller)('inventory'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map