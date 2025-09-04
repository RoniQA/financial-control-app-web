import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  async create(@Body() createProductDto: CreateProductDto, @Request() req: any) {
    // Override companyId with the one from JWT token
    createProductDto.companyId = req.user.companyId;
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos' })
  async findAll(@Query() filters: any, @Request() req: any) {
    const companyId = req.user.companyId;
    return this.productsService.findAll(companyId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter produto por ID' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Get('sku/:sku')
  @ApiOperation({ summary: 'Obter produto por SKU' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  async findBySku(@Param('sku') sku: string) {
    // TODO: Get companyId from JWT token
    const companyId = 'cmf1uv2gc0000z0axy1xdrony'; // Nova Agro company ID
    return this.productsService.findBySku(companyId, sku);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover produto' })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':id/prices')
  @ApiOperation({ summary: 'Atualizar preço do produto' })
  @ApiResponse({ status: 201, description: 'Preço atualizado com sucesso' })
  async updatePrice(@Param('id') productId: string, @Body() priceData: any) {
    return this.productsService.updatePrice(productId, priceData);
  }

  @Get(':id/stock')
  @ApiOperation({ summary: 'Obter estoque do produto' })
  @ApiResponse({ status: 200, description: 'Estoque do produto' })
  async getStock(@Param('id') productId: string, @Query('warehouseId') warehouseId?: string) {
    return this.productsService.getStock(productId, warehouseId);
  }
}

