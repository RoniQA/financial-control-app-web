import { WarehousesService } from './warehouses.service';
export declare class WarehousesController {
    private readonly warehousesService;
    constructor(warehousesService: WarehousesService);
    getDefaultWarehouse(req: any): Promise<{
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
    getAllWarehouses(req: any): Promise<{
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
