import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateStockMoveDto {
  @ApiProperty({ example: 'IN', enum: ['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT'] })
  @IsString()
  type: string;

  @ApiProperty({ example: 'product-id' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 'warehouse-id' })
  @IsString()
  warehouseId: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 25.50, required: false })
  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @ApiProperty({ example: 255.00, required: false })
  @IsOptional()
  @IsNumber()
  totalCost?: number;

  @ApiProperty({ example: 'PO-001', required: false })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({ example: 'order-id', required: false })
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiProperty({ example: 'LOTE-2024-001', required: false })
  @IsOptional()
  @IsString()
  batch?: string;

  @ApiProperty({ example: 'SN-123456', required: false })
  @IsOptional()
  @IsString()
  serial?: string;

  @ApiProperty({ example: 'Entrada por compra', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

