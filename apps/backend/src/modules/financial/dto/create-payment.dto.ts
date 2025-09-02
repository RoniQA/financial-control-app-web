import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 'OUTBOUND', enum: ['INBOUND', 'OUTBOUND'] })
  @IsString()
  type: string;

  @ApiProperty({ example: 'PIX', enum: ['CASH', 'PIX', 'BOLETO', 'CARD', 'TRANSFER'] })
  @IsString()
  method: string;

  @ApiProperty({ example: 100.00 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'Pagamento de fornecedor', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'PO-001', required: false })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({ example: 'order-id', required: false })
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  fees?: number;

  @ApiProperty({ example: 'company-id' })
  @IsString()
  companyId: string;

  @ApiProperty({ example: 'partner-id', required: false })
  @IsOptional()
  @IsString()
  partnerId?: string;

  @ApiProperty({ example: 'user-id' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'invoice-id', required: false })
  @IsOptional()
  @IsString()
  invoiceId?: string;

  @ApiProperty({ example: 'bank-account-id', required: false })
  @IsOptional()
  @IsString()
  bankAccountId?: string;
}

