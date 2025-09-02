import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
  async create(@Body() createOrderDto: CreateOrderDto) {
    // TODO: Get companyId from JWT token
    const companyId = 'temp-company-id';
    return this.ordersService.create(createOrderDto, companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pedidos' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos' })
  async findAll(@Query() filters: any) {
    // TODO: Get companyId from JWT token
    const companyId = 'temp-company-id';
    return this.ordersService.findAll(companyId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter pedido por ID' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar pedido' })
  @ApiResponse({ status: 200, description: 'Pedido atualizado com sucesso' })
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    // TODO: Get companyId from JWT token
    const companyId = 'temp-company-id';
    return this.ordersService.update(id, updateOrderDto, companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover pedido' })
  @ApiResponse({ status: 200, description: 'Pedido removido com sucesso' })
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}

