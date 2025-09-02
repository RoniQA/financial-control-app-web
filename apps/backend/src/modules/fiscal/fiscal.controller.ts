import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { FiscalService } from './fiscal.service';
import { CreateNfeDto } from './dto/create-nfe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Fiscal')
@Controller('fiscal')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FiscalController {
  constructor(private readonly fiscalService: FiscalService) {}

  @Post('nfe')
  @ApiOperation({ summary: 'Criar nova NFe' })
  @ApiResponse({ status: 201, description: 'NFe criada com sucesso' })
  async createNfe(@Body() createNfeDto: CreateNfeDto) {
    return this.fiscalService.createNfe(createNfeDto);
  }

  @Get('nfe')
  @ApiOperation({ summary: 'Listar NFe' })
  @ApiResponse({ status: 200, description: 'Lista de NFe' })
  async findAllNfe(@Query() filters: any) {
    // TODO: Get companyId from JWT token
    const companyId = 'temp-company-id';
    return this.fiscalService.findAllNfe(companyId, filters);
  }

  @Get('nfe/:id')
  @ApiOperation({ summary: 'Obter NFe por ID' })
  @ApiResponse({ status: 200, description: 'NFe encontrada' })
  async findNfeById(@Param('id') id: string) {
    return this.fiscalService.findNfeById(id);
  }

  @Patch('nfe/:id/status')
  @ApiOperation({ summary: 'Atualizar status da NFe' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  async updateNfeStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('xmlContent') xmlContent?: string,
    @Body('protocol') protocol?: string,
  ) {
    return this.fiscalService.updateNfeStatus(id, status, xmlContent, protocol);
  }

  @Post('nfse')
  @ApiOperation({ summary: 'Criar nova NFS-e' })
  @ApiResponse({ status: 201, description: 'NFS-e criada com sucesso' })
  async createNfse(@Body() createNfseDto: any) {
    return this.fiscalService.createNfse(createNfseDto);
  }

  @Post('nfce')
  @ApiOperation({ summary: 'Criar nova NFC-e' })
  @ApiResponse({ status: 201, description: 'NFC-e criada com sucesso' })
  async createNfce(@Body() createNfceDto: any) {
    return this.fiscalService.createNfce(createNfceDto);
  }
}

