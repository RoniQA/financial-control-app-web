import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPartnerDto: CreatePartnerDto) {
    return this.prisma.partner.create({
      data: createPartnerDto,
    });
  }

  async findAll(companyId: string, filters?: any) {
    const where: any = {
      companyId,
      deletedAt: null,
    };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { document: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.partner.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException('Parceiro não encontrado');
    }

    return partner;
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto) {
    await this.findById(id);
    return this.prisma.partner.update({
      where: { id },
      data: updatePartnerDto,
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.partner.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

