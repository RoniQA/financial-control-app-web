import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateNfeDto } from './dto/create-nfe.dto';

@Injectable()
export class FiscalService {
  constructor(private readonly prisma: PrismaService) {}

  async createNfe(createNfeDto: CreateNfeDto) {
    return this.prisma.nfeDocument.create({
      data: createNfeDto,
    });
  }

  async findAllNfe(companyId: string, filters?: any) {
    const where: any = {
      companyId,
    };

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.nfeDocument.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findNfeById(id: string) {
    const nfe = await this.prisma.nfeDocument.findUnique({
      where: { id },
    });

    if (!nfe) {
      throw new NotFoundException('NFe não encontrada');
    }

    return nfe;
  }

  async updateNfeStatus(id: string, status: string, xmlContent?: string, protocol?: string) {
    const updateData: any = { status };
    
    if (xmlContent) updateData.xmlContent = xmlContent;
    if (protocol) updateData.protocol = protocol;
    
    if (status === 'AUTHORIZED') {
      updateData.authorizedAt = new Date();
    } else if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date();
    }

    return this.prisma.nfeDocument.update({
      where: { id },
      data: updateData,
    });
  }

  async createNfse(createNfseDto: any) {
    return this.prisma.nfseDocument.create({
      data: createNfseDto,
    });
  }

  async createNfce(createNfceDto: any) {
    return this.prisma.nfceDocument.create({
      data: createNfceDto,
    });
  }
}

