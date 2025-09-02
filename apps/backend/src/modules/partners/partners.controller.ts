import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Partners')
@Controller('partners')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo parceiro' })
  @ApiResponse({ status: 201, description: 'Parceiro criado com sucesso' })
  async create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnersService.create(createPartnerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar parceiros' })
  @ApiResponse({ status: 200, description: 'Lista de parceiros' })
  async findAll(@Query() filters: any) {
    // TODO: Get companyId from JWT token
    const companyId = 'cmf1uv2gc0000z0axy1xdrony'; // Nova Agro company ID
    return this.partnersService.findAll(companyId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter parceiro por ID' })
  @ApiResponse({ status: 200, description: 'Parceiro encontrado' })
  async findOne(@Param('id') id: string) {
    return this.partnersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar parceiro' })
  @ApiResponse({ status: 200, description: 'Parceiro atualizado com sucesso' })
  async update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnersService.update(id, updatePartnerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover parceiro' })
  @ApiResponse({ status: 200, description: 'Parceiro removido com sucesso' })
  async remove(@Param('id') id: string) {
    return this.partnersService.remove(id);
  }
}

