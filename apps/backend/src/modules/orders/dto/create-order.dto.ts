import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'product-id' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 25.50 })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  tax?: number;

  @ApiProperty({ example: 51.00 })
  @IsNumber()
  total: number;

  @ApiProperty({ example: 'Observações do item', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'PO-001' })
  @IsString()
  number: string;

  @ApiProperty({ example: 'PURCHASE', enum: ['PURCHASE', 'SALE', 'QUOTE', 'WORK_ORDER'] })
  @IsString()
  type: string;

  @ApiProperty({ example: 'DRAFT', enum: ['DRAFT', 'PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })
  @IsString()
  status: string;

  @ApiProperty({ example: 'partner-id', required: false })
  @IsOptional()
  @IsString()
  partnerId?: string;

  @ApiProperty({ example: 'user-id' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 100.00, default: 0 })
  @IsOptional()
  @IsNumber()
  total?: number;

  @ApiProperty({ example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({ example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  tax?: number;

  @ApiProperty({ example: 'Observações do pedido', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @ApiProperty({ example: '2024-01-15', required: false })
  @IsOptional()
  @IsDateString()
  orderDate?: string;



  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

