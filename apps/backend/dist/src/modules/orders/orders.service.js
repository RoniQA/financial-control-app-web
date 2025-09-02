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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const inventory_service_1 = require("../inventory/inventory.service");
const financial_service_1 = require("../financial/financial.service");
let OrdersService = class OrdersService {
    constructor(prisma, inventoryService, financialService) {
        this.prisma = prisma;
        this.inventoryService = inventoryService;
        this.financialService = financialService;
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
                orderDate: createOrderDto.orderDate ? new Date(createOrderDto.orderDate) : new Date(),
                validUntil: createOrderDto.validUntil ? new Date(createOrderDto.validUntil) : null,
                companyId: companyId,
                userId: createOrderDto.userId,
                partnerId: createOrderDto.partnerId,
                items: {
                    create: createOrderDto.items?.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        discount: item.discount || 0,
                        tax: item.tax || 0,
                        total: item.total,
                        notes: item.notes,
                    })) || [],
                },
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
        const existingOrder = await this.findById(id);
        if (updateOrderDto.items) {
            console.log('Deleting existing items and creating new ones');
            await this.prisma.orderItem.deleteMany({
                where: { orderId: id }
            });
        }
        const updatedOrder = await this.prisma.order.update({
            where: { id, companyId },
            data: {
                ...(updateOrderDto.number && { number: updateOrderDto.number }),
                ...(updateOrderDto.type && { type: updateOrderDto.type }),
                ...(updateOrderDto.status && { status: updateOrderDto.status }),
                ...(updateOrderDto.total !== undefined && { total: updateOrderDto.total }),
                ...(updateOrderDto.discount !== undefined && { discount: updateOrderDto.discount }),
                ...(updateOrderDto.tax !== undefined && { tax: updateOrderDto.tax }),
                ...(updateOrderDto.notes && { notes: updateOrderDto.notes }),
                ...(updateOrderDto.orderDate && { orderDate: new Date(updateOrderDto.orderDate) }),
                ...(updateOrderDto.validUntil && { validUntil: new Date(updateOrderDto.validUntil) }),
                ...(updateOrderDto.partnerId && { partnerId: updateOrderDto.partnerId }),
                ...(updateOrderDto.items && {
                    items: {
                        create: updateOrderDto.items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            discount: item.discount || 0,
                            tax: item.tax || 0,
                            total: item.total,
                            notes: item.notes,
                        }))
                    }
                }),
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
        if (updateOrderDto.status && updateOrderDto.status !== existingOrder.status) {
            console.log('🔄 Status changed from', existingOrder.status, 'to', updateOrderDto.status);
            await this.handleStockUpdate(existingOrder, updatedOrder);
        }
        return updatedOrder;
    }
    async remove(id) {
        await this.findById(id);
        return this.prisma.order.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async handleStockUpdate(existingOrder, updatedOrder) {
        const { type, status: newStatus, items } = updatedOrder;
        const { status: oldStatus } = existingOrder;
        if (type === 'SALE' && (newStatus === 'IN_DELIVERY' || newStatus === 'COMPLETED')) {
            if (items && items.length > 0) {
                for (const item of items) {
                    if (item.productId && item.quantity > 0) {
                        try {
                            await this.inventoryService.createStockMove({
                                productId: item.productId,
                                warehouseId: 'cmf1uv2n8000az0axienbav97',
                                type: 'OUT',
                                quantity: item.quantity,
                                reason: `Venda - Pedido ${updatedOrder.number}`,
                                reference: 'ORDER',
                                referenceId: updatedOrder.id,
                            });
                        }
                        catch (error) {
                            console.error(`Error updating stock for product ${item.productId}:`, error);
                        }
                    }
                }
            }
        }
        if (type === 'PURCHASE' && newStatus === 'COMPLETED') {
            if (items && items.length > 0) {
                for (const item of items) {
                    if (item.productId && item.quantity > 0) {
                        try {
                            await this.inventoryService.createStockMove({
                                productId: item.productId,
                                warehouseId: 'cmf1uv2n8000az0axienbav97',
                                type: 'IN',
                                quantity: item.quantity,
                                reason: `Compra - Pedido ${updatedOrder.number}`,
                                reference: 'ORDER',
                                referenceId: updatedOrder.id,
                            });
                        }
                        catch (error) {
                            console.error(`Error updating stock for product ${item.productId}:`, error);
                        }
                    }
                }
            }
        }
        if (newStatus === 'COMPLETED') {
            console.log('💰 Order completed, creating financial notification for:', updatedOrder.number);
            await this.createFinancialNotification(updatedOrder);
        }
    }
    async createFinancialNotification(order) {
        try {
            console.log('🔍 Creating financial notification for order:', order.number, 'Type:', order.type, 'Total:', order.total);
            const existingPayment = await this.prisma.payment.findFirst({
                where: {
                    referenceId: order.id,
                    companyId: order.companyId,
                },
            });
            if (existingPayment) {
                console.log('⚠️ Payment already exists for order:', order.number);
                return;
            }
            const existingNotification = await this.prisma.financialNotification.findFirst({
                where: {
                    orderId: order.id,
                    companyId: order.companyId,
                },
            });
            if (existingNotification) {
                console.log('⚠️ Notification already exists for order:', order.number);
                return;
            }
            const notification = await this.prisma.financialNotification.create({
                data: {
                    companyId: order.companyId,
                    orderId: order.id,
                    type: order.type === 'SALE' ? 'INBOUND' : 'OUTBOUND',
                    amount: order.total,
                    description: order.type === 'SALE'
                        ? `Venda - Pedido ${order.number}`
                        : `Compra - Pedido ${order.number}`,
                    status: 'PENDING',
                    partnerId: order.partnerId,
                    userId: order.userId,
                },
            });
            console.log('✅ Financial notification created:', notification.id);
        }
        catch (error) {
            console.error('❌ Error creating financial notification:', error);
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => inventory_service_1.InventoryService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => financial_service_1.FinancialService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        inventory_service_1.InventoryService,
        financial_service_1.FinancialService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map