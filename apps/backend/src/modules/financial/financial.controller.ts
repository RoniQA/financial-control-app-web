import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { FinancialService } from './financial.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Financial')
@Controller('financial')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Post('payments')
  @ApiOperation({ summary: 'Criar novo pagamento' })
  @ApiResponse({ status: 201, description: 'Pagamento criado com sucesso' })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.financialService.createPayment(createPaymentDto);
  }

  @Get('payments')
  @ApiOperation({ summary: 'Listar pagamentos' })
  @ApiResponse({ status: 200, description: 'Lista de pagamentos' })
  async findAllPayments(@Query() filters: any) {
    // TODO: Get companyId from JWT token
    const companyId = 'temp-company-id';
    return this.financialService.findAllPayments(companyId, filters);
  }

  @Get('payments/:id')
  @ApiOperation({ summary: 'Obter pagamento por ID' })
  @ApiResponse({ status: 200, description: 'Pagamento encontrado' })
  async findPaymentById(@Param('id') id: string) {
    return this.financialService.findPaymentById(id);
  }

  @Patch('payments/:id')
  @ApiOperation({ summary: 'Atualizar pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento atualizado com sucesso' })
  async updatePayment(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.financialService.updatePayment(id, updatePaymentDto);
  }

  @Delete('payments/:id')
  @ApiOperation({ summary: 'Remover pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento removido com sucesso' })
  async removePayment(@Param('id') id: string) {
    return this.financialService.removePayment(id);
  }

  @Get('cash-flow')
  @ApiOperation({ summary: 'Obter fluxo de caixa' })
  @ApiResponse({ status: 200, description: 'Fluxo de caixa' })
  async getCashFlow(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // TODO: Get companyId from JWT token
    const companyId = 'cmf1uv2gc0000z0axy1xdrony';
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.financialService.getCashFlow(companyId, start, end);
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Obter notificações financeiras pendentes' })
  @ApiResponse({ status: 200, description: 'Lista de notificações financeiras' })
  async getFinancialNotifications() {
    const companyId = 'cmf1uv2gc0000z0axy1xdrony';
    return this.financialService.getFinancialNotifications(companyId);
  }

  @Post('notifications/:id/approve')
  @ApiOperation({ summary: 'Aprovar notificação financeira' })
  @ApiResponse({ status: 200, description: 'Notificação aprovada e pagamento criado' })
  async approveFinancialNotification(@Param('id') id: string) {
    const companyId = 'cmf1uv2gc0000z0axy1xdrony';
    return this.financialService.approveFinancialNotification(id, companyId);
  }

  @Post('notifications/:id/reject')
  @ApiOperation({ summary: 'Rejeitar notificação financeira' })
  @ApiResponse({ status: 200, description: 'Notificação rejeitada' })
  async rejectFinancialNotification(@Param('id') id: string) {
    const companyId = 'cmf1uv2gc0000z0axy1xdrony';
    return this.financialService.rejectFinancialNotification(id, companyId);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Obter saldo da empresa' })
  @ApiResponse({ status: 200, description: 'Saldo da empresa' })
  async getCompanyBalance() {
    const companyId = 'cmf1uv2gc0000z0axy1xdrony';
    return this.financialService.getCompanyBalance(companyId);
  }
}

