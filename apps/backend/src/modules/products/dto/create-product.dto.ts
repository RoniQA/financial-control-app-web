import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, IsObject } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'BOMBA-001' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 'Bomba Centrífuga 1/2 CV' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Bomba centrífuga para água limpa', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Bombas', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'Schneider', required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ example: 'Bomba-1/2CV-220V', required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ 
    example: { voltage: '220V', power: '1/2 CV' },
    required: false 
  })
  @IsOptional()
  @IsObject()
  variations?: any;

  @ApiProperty({ example: '8414.10.00', required: false })
  @IsOptional()
  @IsString()
  ncm?: string;

  @ApiProperty({ example: '28.038.00', required: false })
  @IsOptional()
  @IsString()
  cest?: string;

  @ApiProperty({ example: 'UN', default: 'UN' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 15.5, required: false })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty({ 
    example: { length: 30, width: 20, height: 25 },
    required: false 
  })
  @IsOptional()
  @IsObject()
  dimensions?: any;

  @ApiProperty({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isService?: boolean;

  @ApiProperty({ example: 'company-id' })
  @IsString()
  companyId: string;
}

