import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @ApiOperation({ summary: 'Relatório de vendas' })
  @ApiResponse({ status: 200, description: 'Relatório de vendas' })
  async getSalesReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // TODO: Get companyId from JWT token
    const companyId = 'temp-company-id';
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportsService.getSalesReport(companyId, start, end);
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Relatório de estoque' })
  @ApiResponse({ status: 200, description: 'Relatório de estoque' })
  async getInventoryReport() {
    // TODO: Get companyId from JWT token
    const companyId = 'temp-company-id';
    return this.reportsService.getInventoryReport(companyId);
  }

  @Get('financial')
  @ApiOperation({ summary: 'Relatório financeiro' })
  @ApiResponse({ status: 200, description: 'Relatório financeiro' })
  async getFinancialReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // TODO: Get companyId from JWT token
    const companyId = 'temp-company-id';
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportsService.getFinancialReport(companyId, start, end);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Dados do dashboard' })
  @ApiResponse({ status: 200, description: 'Dados do dashboard' })
  async getDashboardData() {
    // TODO: Get companyId from JWT token
    const companyId = 'temp-company-id';
    return this.reportsService.getDashboardData(companyId);
  }
}

