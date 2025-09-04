import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
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
  async create(@Body() createPartnerDto: CreatePartnerDto, @Request() req: any) {
    // Override companyId with the one from JWT token
    createPartnerDto.companyId = req.user.companyId;
    return this.partnersService.create(createPartnerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar parceiros' })
  @ApiResponse({ status: 200, description: 'Lista de parceiros' })
  async findAll(@Query() filters: any, @Request() req: any) {
    const companyId = req.user.companyId;
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

