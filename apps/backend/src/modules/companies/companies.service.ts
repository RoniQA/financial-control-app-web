import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: createCompanyDto,
    });
  }

  async findAll() {
    return this.prisma.company.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findById(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return company;
  }

  async findByCnpj(cnpj: string) {
    return this.prisma.company.findUnique({
      where: { cnpj },
    });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findById(id); // Check if company exists

    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  async remove(id: string) {
    await this.findById(id); // Check if company exists

    return this.prisma.company.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

