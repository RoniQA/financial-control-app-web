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
exports.FiscalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fiscal_service_1 = require("./fiscal.service");
const create_nfe_dto_1 = require("./dto/create-nfe.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let FiscalController = class FiscalController {
    constructor(fiscalService) {
        this.fiscalService = fiscalService;
    }
    async createNfe(createNfeDto) {
        return this.fiscalService.createNfe(createNfeDto);
    }
    async findAllNfe(filters) {
        const companyId = 'temp-company-id';
        return this.fiscalService.findAllNfe(companyId, filters);
    }
    async findNfeById(id) {
        return this.fiscalService.findNfeById(id);
    }
    async updateNfeStatus(id, status, xmlContent, protocol) {
        return this.fiscalService.updateNfeStatus(id, status, xmlContent, protocol);
    }
    async createNfse(createNfseDto) {
        return this.fiscalService.createNfse(createNfseDto);
    }
    async createNfce(createNfceDto) {
        return this.fiscalService.createNfce(createNfceDto);
    }
};
exports.FiscalController = FiscalController;
__decorate([
    (0, common_1.Post)('nfe'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar nova NFe' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'NFe criada com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_nfe_dto_1.CreateNfeDto]),
    __metadata("design:returntype", Promise)
], FiscalController.prototype, "createNfe", null);
__decorate([
    (0, common_1.Get)('nfe'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar NFe' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de NFe' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FiscalController.prototype, "findAllNfe", null);
__decorate([
    (0, common_1.Get)('nfe/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter NFe por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'NFe encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FiscalController.prototype, "findNfeById", null);
__decorate([
    (0, common_1.Patch)('nfe/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar status da NFe' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status atualizado com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('xmlContent')),
    __param(3, (0, common_1.Body)('protocol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], FiscalController.prototype, "updateNfeStatus", null);
__decorate([
    (0, common_1.Post)('nfse'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar nova NFS-e' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'NFS-e criada com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FiscalController.prototype, "createNfse", null);
__decorate([
    (0, common_1.Post)('nfce'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar nova NFC-e' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'NFC-e criada com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FiscalController.prototype, "createNfce", null);
exports.FiscalController = FiscalController = __decorate([
    (0, swagger_1.ApiTags)('Fiscal'),
    (0, common_1.Controller)('fiscal'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [fiscal_service_1.FiscalService])
], FiscalController);
//# sourceMappingURL=fiscal.controller.js.map