import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateNfeDto {
  @ApiProperty({ example: '000001' })
  @IsString()
  number: string;

  @ApiProperty({ example: '001' })
  @IsString()
  series: string;

  @ApiProperty({ example: '35200114200166000187550010000000015123456789' })
  @IsString()
  key: string;

  @ApiProperty({ example: 'DRAFT', enum: ['DRAFT', 'SENT', 'AUTHORIZED', 'DENIED', 'CANCELLED'] })
  @IsString()
  status: string;

  @ApiProperty({ example: 'company-id' })
  @IsString()
  companyId: string;

  @ApiProperty({ example: '<xml>...</xml>', required: false })
  @IsOptional()
  @IsString()
  xmlContent?: string;

  @ApiProperty({ example: 'https://danfe-url.com', required: false })
  @IsOptional()
  @IsString()
  danfeUrl?: string;

  @ApiProperty({ example: '135240000000000', required: false })
  @IsOptional()
  @IsString()
  protocol?: string;

  @ApiProperty({ example: 'Erro na validação', required: false })
  @IsOptional()
  @IsString()
  error?: string;
}

