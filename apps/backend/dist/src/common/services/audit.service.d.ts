import { PrismaService } from '../../database/prisma.service';
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    log(userId: string, action: string, entity: string, entityId?: string, oldData?: any, newData?: any, ipAddress?: string, userAgent?: string): Promise<void>;
}
