import { Controller, Get, UseGuards } from '@nestjs/common';
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
  async getDefaultWarehouse() {
    return this.warehousesService.getDefaultWarehouse();
  }

  @Get()
  @ApiOperation({ summary: 'Listar warehouses da empresa' })
  @ApiResponse({ status: 200, description: 'Lista de warehouses' })
  async getAllWarehouses() {
    return this.warehousesService.getAllWarehouses();
  }
}
