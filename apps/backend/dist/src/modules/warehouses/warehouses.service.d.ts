import { PrismaService } from '../../database/prisma.service';
export declare class WarehousesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDefaultWarehouse(companyId: string): Promise<{
        id: string;
        name: string;
        address: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        companyId: string;
        code: string;
    }>;
    getAllWarehouses(companyId: string): Promise<{
        id: string;
        name: string;
        address: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        companyId: string;
        code: string;
    }[]>;
}
