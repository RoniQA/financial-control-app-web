import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceItemDto {
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

  @ApiProperty({ example: '5102', required: false })
  @IsOptional()
  @IsString()
  cfop?: string;

  @ApiProperty({ example: '8414.10.00', required: false })
  @IsOptional()
  @IsString()
  ncm?: string;

  @ApiProperty({ example: '28.038.00', required: false })
  @IsOptional()
  @IsString()
  cest?: string;

  @ApiProperty({ example: '101', required: false })
  @IsOptional()
  @IsString()
  csosn?: string;

  @ApiProperty({ example: 18, required: false })
  @IsOptional()
  @IsNumber()
  icms?: number;

  @ApiProperty({ example: 1.65, required: false })
  @IsOptional()
  @IsNumber()
  pis?: number;

  @ApiProperty({ example: 7.6, required: false })
  @IsOptional()
  @IsNumber()
  cofins?: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  ipi?: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ example: 'NF-001' })
  @IsString()
  number: string;

  @ApiProperty({ example: 'OUTBOUND', enum: ['INBOUND', 'OUTBOUND'] })
  @IsString()
  type: string;

  @ApiProperty({ example: 'DRAFT', enum: ['DRAFT', 'SENT', 'PAID', 'CANCELLED'] })
  @IsString()
  status: string;

  @ApiProperty({ example: 'partner-id', required: false })
  @IsOptional()
  @IsString()
  partnerId?: string;

  @ApiProperty({ example: 'user-id' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'order-id', required: false })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({ example: 100.00, default: 0 })
  @IsOptional()
  @IsNumber()
  total?: number;

  @ApiProperty({ example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  tax?: number;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: 'Observações da nota', required: false })
  @IsOptional()
  @IsString()
  notes?: string;



  @ApiProperty({ type: [CreateInvoiceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];
}

