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
exports.PartnersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const partners_service_1 = require("./partners.service");
const create_partner_dto_1 = require("./dto/create-partner.dto");
const update_partner_dto_1 = require("./dto/update-partner.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PartnersController = class PartnersController {
    constructor(partnersService) {
        this.partnersService = partnersService;
    }
    async create(createPartnerDto) {
        return this.partnersService.create(createPartnerDto);
    }
    async findAll(filters) {
        const companyId = 'cmf1uv2gc0000z0axy1xdrony';
        return this.partnersService.findAll(companyId, filters);
    }
    async findOne(id) {
        return this.partnersService.findById(id);
    }
    async update(id, updatePartnerDto) {
        return this.partnersService.update(id, updatePartnerDto);
    }
    async remove(id) {
        return this.partnersService.remove(id);
    }
};
exports.PartnersController = PartnersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo parceiro' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Parceiro criado com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_partner_dto_1.CreatePartnerDto]),
    __metadata("design:returntype", Promise)
], PartnersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar parceiros' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de parceiros' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PartnersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter parceiro por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Parceiro encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PartnersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar parceiro' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Parceiro atualizado com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_partner_dto_1.UpdatePartnerDto]),
    __metadata("design:returntype", Promise)
], PartnersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover parceiro' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Parceiro removido com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PartnersController.prototype, "remove", null);
exports.PartnersController = PartnersController = __decorate([
    (0, swagger_1.ApiTags)('Partners'),
    (0, common_1.Controller)('partners'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [partners_service_1.PartnersService])
], PartnersController);
//# sourceMappingURL=partners.controller.js.map