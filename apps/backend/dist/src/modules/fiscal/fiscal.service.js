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
exports.FiscalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let FiscalService = class FiscalService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createNfe(createNfeDto) {
        return this.prisma.nfeDocument.create({
            data: createNfeDto,
        });
    }
    async findAllNfe(companyId, filters) {
        const where = {
            companyId,
        };
        if (filters?.status) {
            where.status = filters.status;
        }
        return this.prisma.nfeDocument.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findNfeById(id) {
        const nfe = await this.prisma.nfeDocument.findUnique({
            where: { id },
        });
        if (!nfe) {
            throw new common_1.NotFoundException('NFe não encontrada');
        }
        return nfe;
    }
    async updateNfeStatus(id, status, xmlContent, protocol) {
        const updateData = { status };
        if (xmlContent)
            updateData.xmlContent = xmlContent;
        if (protocol)
            updateData.protocol = protocol;
        if (status === 'AUTHORIZED') {
            updateData.authorizedAt = new Date();
        }
        else if (status === 'CANCELLED') {
            updateData.cancelledAt = new Date();
        }
        return this.prisma.nfeDocument.update({
            where: { id },
            data: updateData,
        });
    }
    async createNfse(createNfseDto) {
        return this.prisma.nfseDocument.create({
            data: createNfseDto,
        });
    }
    async createNfce(createNfceDto) {
        return this.prisma.nfceDocument.create({
            data: createNfceDto,
        });
    }
};
exports.FiscalService = FiscalService;
exports.FiscalService = FiscalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FiscalService);
//# sourceMappingURL=fiscal.service.js.map