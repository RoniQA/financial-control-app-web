import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    console.log('🔍 ProductsService.create - createProductDto:', JSON.stringify(createProductDto, null, 2));
    
    // Check if SKU already exists for this company
    const existingProduct = await this.prisma.product.findUnique({
      where: {
        companyId_sku: {
          companyId: createProductDto.companyId,
          sku: createProductDto.sku,
        },
      },
    });

    if (existingProduct) {
      console.log('❌ SKU already exists:', createProductDto.sku);
      throw new Error(`SKU '${createProductDto.sku}' já existe para esta empresa`);
    }

    console.log('✅ Creating product with data:', createProductDto);
    const result = await this.prisma.product.create({
      data: createProductDto,
      include: {
        prices: true,
        stocks: {
          include: {
            warehouse: true,
          },
        },
      },
    });
    
    console.log('✅ Product created successfully:', JSON.stringify(result, null, 2));
    return result;
  }

  async findAll(companyId: string, filters?: any) {
    console.log('🔍 ProductsService.findAll - companyId:', companyId, 'filters:', filters);
    
    const where: any = {
      companyId,
      deletedAt: null,
    };

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    console.log('🔍 ProductsService.findAll - where clause:', JSON.stringify(where, null, 2));

    const result = await this.prisma.product.findMany({
      where,
      include: {
        prices: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        stocks: {
          include: {
            warehouse: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    console.log('📦 ProductsService.findAll - found products:', result.length);
    return result;
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        prices: {
          orderBy: { createdAt: 'desc' },
        },
        stocks: {
          include: {
            warehouse: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async findBySku(companyId: string, sku: string) {
    return this.prisma.product.findUnique({
      where: {
        companyId_sku: {
          companyId,
          sku,
        },
      },
      include: {
        prices: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        stocks: {
          include: {
            warehouse: true,
          },
        },
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findById(id); // Check if product exists

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        prices: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        stocks: {
          include: {
            warehouse: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findById(id); // Check if product exists

    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async updatePrice(productId: string, priceData: any) {
    // Create new price entry
    return this.prisma.productPrice.create({
      data: {
        productId,
        ...priceData,
      },
    });
  }

  async getStock(productId: string, warehouseId?: string) {
    const where: any = { productId };
    
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    return this.prisma.stock.findMany({
      where,
      include: {
        warehouse: true,
      },
    });
  }
}

