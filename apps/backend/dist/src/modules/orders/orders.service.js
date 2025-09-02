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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOrderDto, companyId) {
        return this.prisma.order.create({
            data: {
                number: createOrderDto.number,
                type: createOrderDto.type,
                status: createOrderDto.status,
                total: createOrderDto.total || 0,
                discount: createOrderDto.discount || 0,
                tax: createOrderDto.tax || 0,
                notes: createOrderDto.notes,
                validUntil: createOrderDto.validUntil ? new Date(createOrderDto.validUntil) : null,
                companyId: companyId,
                userId: createOrderDto.userId,
                partnerId: createOrderDto.partnerId,
            },
            include: {
                partner: true,
                user: true,
                items: {
                    include: {
                        product: true,
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
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        return this.prisma.order.findMany({
            where,
            include: {
                partner: true,
                user: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                partner: true,
                user: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Pedido não encontrado');
        }
        return order;
    }
    async update(id, updateOrderDto, companyId) {
        await this.findById(id);
        return this.prisma.order.update({
            where: { id, companyId },
            data: {
                ...(updateOrderDto.number && { number: updateOrderDto.number }),
                ...(updateOrderDto.type && { type: updateOrderDto.type }),
                ...(updateOrderDto.status && { status: updateOrderDto.status }),
                ...(updateOrderDto.total !== undefined && { total: updateOrderDto.total }),
                ...(updateOrderDto.discount !== undefined && { discount: updateOrderDto.discount }),
                ...(updateOrderDto.tax !== undefined && { tax: updateOrderDto.tax }),
                ...(updateOrderDto.notes && { notes: updateOrderDto.notes }),
                ...(updateOrderDto.validUntil && { validUntil: new Date(updateOrderDto.validUntil) }),
                ...(updateOrderDto.partnerId && { partnerId: updateOrderDto.partnerId }),
            },
            include: {
                partner: true,
                user: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    async remove(id) {
        await this.findById(id);
        return this.prisma.order.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map