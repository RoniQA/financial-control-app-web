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
    console.log('🔍 ProductsController.create - Original DTO:', JSON.stringify(createProductDto, null, 2));
    console.log('🔍 ProductsController.create - User from JWT:', JSON.stringify(req.user, null, 2));
    
    // Override companyId with the one from JWT token
    createProductDto.companyId = req.user.companyId;
    
    console.log('🔍 ProductsController.create - Modified DTO:', JSON.stringify(createProductDto, null, 2));
    
    const result = await this.productsService.create(createProductDto);
    console.log('✅ ProductsController.create - Result:', JSON.stringify(result, null, 2));
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos' })
  async findAll(@Query() filters: any, @Request() req: any) {
    const companyId = req.user.companyId;
    console.log('🔍 ProductsController.findAll - companyId:', companyId, 'filters:', filters);
    const result = await this.productsService.findAll(companyId, filters);
    console.log('📦 ProductsController.findAll - result count:', result?.length || 0);
    return result;
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

  @Get('test/simple')
  @ApiOperation({ summary: 'Simple test endpoint without auth' })
  @ApiResponse({ status: 200, description: 'Simple test response' })
  async simpleTest() {
    console.log('🔍 Simple test endpoint called - path: /api/products/test/simple');
    return {
      message: 'Simple test endpoint working',
      timestamp: new Date().toISOString(),
      path: '/api/products/test/simple'
    };
  }

  @Get('test/debug')
  @ApiOperation({ summary: 'Debug endpoint to test data flow' })
  @ApiResponse({ status: 200, description: 'Debug information' })
  async debug(@Request() req: any) {
    console.log('🔍 Debug endpoint called - path: /api/products/test/debug');
    console.log('🔍 Debug endpoint - req.user:', req.user);
    
    const companyId = req.user?.companyId;
    console.log('🔍 Debug endpoint - companyId:', companyId);
    
    if (!companyId) {
      return {
        error: 'No companyId found in request',
        user: req.user,
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      const products = await this.productsService.findAll(companyId, {});
      console.log('🔍 Debug endpoint - products count:', products?.length || 0);
      
      return {
        companyId,
        productsCount: products?.length || 0,
        products: products || [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('🔍 Debug endpoint - error:', error);
      return {
        error: error.message,
        companyId,
        timestamp: new Date().toISOString()
      };
    }
  }
}

