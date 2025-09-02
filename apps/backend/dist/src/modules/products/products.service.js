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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createProductDto) {
        return this.prisma.product.create({
            data: createProductDto,
            include: {
                prices: true,
                stocks: {
                    include: {
                        warehouse: true,
                    },
                },
            },
        });
    }
    async findAll(companyId, filters) {
        const where = {
            companyId,
            deletedAt: null,
        };
        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { sku: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        if (filters?.category) {
            where.category = filters.category;
        }
        if (filters?.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        return this.prisma.product.findMany({
            where,
            include: {
                prices: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                stocks: {
                    include: {
                        warehouse: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async findById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                prices: {
                    orderBy: { createdAt: 'desc' },
                },
                stocks: {
                    include: {
                        warehouse: true,
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Produto não encontrado');
        }
        return product;
    }
    async findBySku(companyId, sku) {
        return this.prisma.product.findUnique({
            where: {
                companyId_sku: {
                    companyId,
                    sku,
                },
            },
            include: {
                prices: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                stocks: {
                    include: {
                        warehouse: true,
                    },
                },
            },
        });
    }
    async update(id, updateProductDto) {
        await this.findById(id);
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
            include: {
                prices: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                stocks: {
                    include: {
                        warehouse: true,
                    },
                },
            },
        });
    }
    async remove(id) {
        await this.findById(id);
        return this.prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async updatePrice(productId, priceData) {
        return this.prisma.productPrice.create({
            data: {
                productId,
                ...priceData,
            },
        });
    }
    async getStock(productId, warehouseId) {
        const where = { productId };
        if (warehouseId) {
            where.warehouseId = warehouseId;
        }
        return this.prisma.stock.findMany({
            where,
            include: {
                warehouse: true,
            },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map