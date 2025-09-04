import { Controller, Get, Post, Body, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { InventoryService } from './inventory.service';
import { CreateStockMoveDto } from './dto/create-stock-move.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('stock-moves')
  @ApiOperation({ summary: 'Criar movimentação de estoque' })
  @ApiResponse({ status: 201, description: 'Movimentação criada com sucesso' })
  async createStockMove(@Body() createStockMoveDto: CreateStockMoveDto) {
    return this.inventoryService.createStockMove(createStockMoveDto);
  }

  @Get('stock-moves')
  @ApiOperation({ summary: 'Listar movimentações de estoque' })
  @ApiResponse({ status: 200, description: 'Lista de movimentações' })
  async getStockMoves(
    @Query('productId') productId?: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.inventoryService.getStockMoves(productId, warehouseId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Resumo do estoque' })
  @ApiResponse({ status: 200, description: 'Resumo do estoque' })
  async getStockSummary(@Request() req: any) {
    const companyId = req.user.companyId;
    return this.inventoryService.getStockSummary(companyId);
  }
}

