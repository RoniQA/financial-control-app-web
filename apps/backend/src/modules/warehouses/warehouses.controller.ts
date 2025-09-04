import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { WarehousesService } from './warehouses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Warehouses')
@Controller('warehouses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get('default')
  @ApiOperation({ summary: 'Obter warehouse padrão da empresa' })
  @ApiResponse({ status: 200, description: 'Warehouse padrão encontrado' })
  async getDefaultWarehouse(@Request() req: any) {
    return this.warehousesService.getDefaultWarehouse(req.user.companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar warehouses da empresa' })
  @ApiResponse({ status: 200, description: 'Lista de warehouses' })
  async getAllWarehouses(@Request() req: any) {
    return this.warehousesService.getAllWarehouses(req.user.companyId);
  }
}
