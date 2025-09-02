import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Invoices')
@Controller('invoices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova nota fiscal' })
  @ApiResponse({ status: 201, description: 'Nota fiscal criada com sucesso' })
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    // TODO: Get companyId from JWT token
    const companyId = 'temp-company-id';
    return this.invoicesService.create(createInvoiceDto, companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar notas fiscais' })
  @ApiResponse({ status: 200, description: 'Lista de notas fiscais' })
  async findAll(@Query() filters: any) {
    // TODO: Get companyId from JWT token
    const companyId = 'temp-company-id';
    return this.invoicesService.findAll(companyId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter nota fiscal por ID' })
  @ApiResponse({ status: 200, description: 'Nota fiscal encontrada' })
  async findOne(@Param('id') id: string) {
    return this.invoicesService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar nota fiscal' })
  @ApiResponse({ status: 200, description: 'Nota fiscal atualizada com sucesso' })
  async update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    // TODO: Get companyId from JWT token
    const companyId = 'temp-company-id';
    return this.invoicesService.update(id, updateInvoiceDto, companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover nota fiscal' })
  @ApiResponse({ status: 200, description: 'Nota fiscal removida com sucesso' })
  async remove(@Param('id') id: string) {
    return this.invoicesService.remove(id);
  }
}

