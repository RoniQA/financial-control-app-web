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
exports.PartnersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let PartnersService = class PartnersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPartnerDto) {
        return this.prisma.partner.create({
            data: createPartnerDto,
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
        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { document: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.partner.findMany({
            where,
            orderBy: { name: 'asc' },
        });
    }
    async findById(id) {
        const partner = await this.prisma.partner.findUnique({
            where: { id },
        });
        if (!partner) {
            throw new common_1.NotFoundException('Parceiro não encontrado');
        }
        return partner;
    }
    async update(id, updatePartnerDto) {
        await this.findById(id);
        return this.prisma.partner.update({
            where: { id },
            data: updatePartnerDto,
        });
    }
    async remove(id) {
        await this.findById(id);
        return this.prisma.partner.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.PartnersService = PartnersService;
exports.PartnersService = PartnersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PartnersService);
//# sourceMappingURL=partners.service.js.map