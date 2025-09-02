import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsObject } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Nova Agro Ltda' })
  @IsString()
  name: string;

  @ApiProperty({ example: '12.345.678/0001-90' })
  @IsString()
  cnpj: string;

  @ApiProperty({ example: '123456789', required: false })
  @IsOptional()
  @IsString()
  ie?: string;

  @ApiProperty({ example: 'contato@novaagro.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '(11) 3333-4444', required: false })
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

  @ApiProperty({ 
    example: {
      regime: 'SIMPLES_NACIONAL',
      csc: 'CSC123456',
      certificate: 'certificate-data'
    },
    required: false 
  })
  @IsOptional()
  @IsObject()
  fiscalConfig?: any;
}

