import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty({ example: 'CUSTOMER', enum: ['CUSTOMER', 'SUPPLIER', 'BOTH'] })
  @IsString()
  type: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  name: string;

  @ApiProperty({ example: '123.456.789-00' })
  @IsString()
  document: string;

  @ApiProperty({ example: '123456789', required: false })
  @IsOptional()
  @IsString()
  ie?: string;

  @ApiProperty({ example: '123456', required: false })
  @IsOptional()
  @IsString()
  im?: string;

  @ApiProperty({ example: 'joao@email.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: '(11) 99999-9999', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ 
    example: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    required: false 
  })
  @IsOptional()
  @IsObject()
  address?: any;

  @ApiProperty({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 'company-id' })
  @IsString()
  companyId: string;
}

