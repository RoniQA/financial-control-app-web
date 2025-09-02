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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createStockMove(createStockMoveDto) {
        console.log('Creating stock move:', createStockMoveDto);
        const stockMove = await this.prisma.stockMove.create({
            data: createStockMoveDto,
            include: {
                product: true,
                warehouse: true,
            },
        });
        console.log('Stock move created:', stockMove);
        const existingStock = await this.prisma.stock.findFirst({
            where: {
                productId: createStockMoveDto.productId,
                warehouseId: createStockMoveDto.warehouseId,
                batch: createStockMoveDto.batch || null,
                serial: createStockMoveDto.serial || null,
            },
        });
        console.log('Existing stock:', existingStock);
        if (existingStock) {
            const newQuantity = createStockMoveDto.type === 'IN'
                ? existingStock.quantity + createStockMoveDto.quantity
                : existingStock.quantity - createStockMoveDto.quantity;
            console.log('Updating stock. Old:', existingStock.quantity, 'New:', newQuantity);
            await this.prisma.stock.update({
                where: {
                    id: existingStock.id,
                },
                data: {
                    quantity: Math.max(0, newQuantity),
                },
            });
        }
        else {
            const quantity = createStockMoveDto.type === 'IN'
                ? createStockMoveDto.quantity
                : -createStockMoveDto.quantity;
            console.log('Creating new stock record with quantity:', quantity);
            await this.prisma.stock.create({
                data: {
                    productId: createStockMoveDto.productId,
                    warehouseId: createStockMoveDto.warehouseId,
                    quantity: Math.max(0, quantity),
                    reserved: 0,
                },
            });
        }
        return stockMove;
    }
    async getStockMoves(productId, warehouseId) {
        const where = {};
        if (productId)
            where.productId = productId;
        if (warehouseId)
            where.warehouseId = warehouseId;
        return this.prisma.stockMove.findMany({
            where,
            include: {
                product: true,
                warehouse: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getStockSummary(companyId) {
        return this.prisma.stock.findMany({
            where: {
                product: {
                    companyId,
                },
            },
            include: {
                product: {
                    select: {
                        id: true,
                        sku: true,
                        name: true,
                        unit: true,
                    },
                },
                warehouse: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
            },
            orderBy: {
                product: {
                    name: 'asc',
                },
            },
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map