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
exports.FinancialController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const financial_service_1 = require("./financial.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const update_payment_dto_1 = require("./dto/update-payment.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let FinancialController = class FinancialController {
    constructor(financialService) {
        this.financialService = financialService;
    }
    async createPayment(createPaymentDto) {
        return this.financialService.createPayment(createPaymentDto);
    }
    async findAllPayments(filters) {
        const companyId = 'temp-company-id';
        return this.financialService.findAllPayments(companyId, filters);
    }
    async findPaymentById(id) {
        return this.financialService.findPaymentById(id);
    }
    async updatePayment(id, updatePaymentDto) {
        return this.financialService.updatePayment(id, updatePaymentDto);
    }
    async removePayment(id) {
        return this.financialService.removePayment(id);
    }
    async getCashFlow(startDate, endDate) {
        const companyId = 'cmf1uv2gc0000z0axy1xdrony';
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.financialService.getCashFlow(companyId, start, end);
    }
    async getFinancialNotifications() {
        const companyId = 'cmf1uv2gc0000z0axy1xdrony';
        return this.financialService.getFinancialNotifications(companyId);
    }
    async approveFinancialNotification(id) {
        const companyId = 'cmf1uv2gc0000z0axy1xdrony';
        return this.financialService.approveFinancialNotification(id, companyId);
    }
    async rejectFinancialNotification(id) {
        const companyId = 'cmf1uv2gc0000z0axy1xdrony';
        return this.financialService.rejectFinancialNotification(id, companyId);
    }
    async getCompanyBalance() {
        const companyId = 'cmf1uv2gc0000z0axy1xdrony';
        return this.financialService.getCompanyBalance(companyId);
    }
};
exports.FinancialController = FinancialController;
__decorate([
    (0, common_1.Post)('payments'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo pagamento' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Pagamento criado com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], FinancialController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Get)('payments'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar pagamentos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de pagamentos' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FinancialController.prototype, "findAllPayments", null);
__decorate([
    (0, common_1.Get)('payments/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter pagamento por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pagamento encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinancialController.prototype, "findPaymentById", null);
__decorate([
    (0, common_1.Patch)('payments/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar pagamento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pagamento atualizado com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_payment_dto_1.UpdatePaymentDto]),
    __metadata("design:returntype", Promise)
], FinancialController.prototype, "updatePayment", null);
__decorate([
    (0, common_1.Delete)('payments/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover pagamento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pagamento removido com sucesso' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinancialController.prototype, "removePayment", null);
__decorate([
    (0, common_1.Get)('cash-flow'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter fluxo de caixa' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fluxo de caixa' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FinancialController.prototype, "getCashFlow", null);
__decorate([
    (0, common_1.Get)('notifications'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter notificações financeiras pendentes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de notificações financeiras' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinancialController.prototype, "getFinancialNotifications", null);
__decorate([
    (0, common_1.Post)('notifications/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Aprovar notificação financeira' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notificação aprovada e pagamento criado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinancialController.prototype, "approveFinancialNotification", null);
__decorate([
    (0, common_1.Post)('notifications/:id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Rejeitar notificação financeira' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notificação rejeitada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinancialController.prototype, "rejectFinancialNotification", null);
__decorate([
    (0, common_1.Get)('balance'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter saldo da empresa' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Saldo da empresa' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinancialController.prototype, "getCompanyBalance", null);
exports.FinancialController = FinancialController = __decorate([
    (0, swagger_1.ApiTags)('Financial'),
    (0, common_1.Controller)('financial'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [financial_service_1.FinancialService])
], FinancialController);
//# sourceMappingURL=financial.controller.js.map