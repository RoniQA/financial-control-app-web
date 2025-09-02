import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(
    userId: string,
    action: string,
    entity: string,
    entityId?: string,
    oldData?: any,
    newData?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action,
          entity,
          entityId,
          oldData: oldData ? JSON.stringify(oldData) : null,
          newData: newData ? JSON.stringify(newData) : null,
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      // Log error but don't throw to avoid breaking the main operation
      console.error('Failed to create audit log:', error);
    }
  }
}

