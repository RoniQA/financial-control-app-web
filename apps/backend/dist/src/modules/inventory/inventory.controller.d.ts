import { InventoryService } from './inventory.service';
import { CreateStockMoveDto } from './dto/create-stock-move.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    createStockMove(createStockMoveDto: CreateStockMoveDto): Promise<{
        warehouse: {
            id: string;
            name: string;
            address: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            isActive: boolean;
            companyId: string;
            code: string;
        };
        product: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            description: string | null;
            isActive: boolean;
            companyId: string;
            sku: string;
            category: string | null;
            brand: string | null;
            model: string | null;
            variations: import("@prisma/client/runtime/library").JsonValue | null;
            ncm: string | null;
            cest: string | null;
            unit: string;
            weight: number | null;
            dimensions: import("@prisma/client/runtime/library").JsonValue | null;
            isService: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        productId: string;
        quantity: number;
        batch: string | null;
        serial: string | null;
        warehouseId: string;
        type: string;
        unitCost: number | null;
        totalCost: number | null;
        reference: string | null;
        referenceId: string | null;
        reason: string | null;
    }>;
    getStockMoves(productId?: string, warehouseId?: string): Promise<({
        warehouse: {
            id: string;
            name: string;
            address: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            isActive: boolean;
            companyId: string;
            code: string;
        };
        product: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            description: string | null;
            isActive: boolean;
            companyId: string;
            sku: string;
            category: string | null;
            brand: string | null;
            model: string | null;
            variations: import("@prisma/client/runtime/library").JsonValue | null;
            ncm: string | null;
            cest: string | null;
            unit: string;
            weight: number | null;
            dimensions: import("@prisma/client/runtime/library").JsonValue | null;
            isService: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        productId: string;
        quantity: number;
        batch: string | null;
        serial: string | null;
        warehouseId: string;
        type: string;
        unitCost: number | null;
        totalCost: number | null;
        reference: string | null;
        referenceId: string | null;
        reason: string | null;
    })[]>;
    getStockSummary(req: any): Promise<({
        warehouse: {
            id: string;
            name: string;
            code: string;
        };
        product: {
            id: string;
            name: string;
            sku: string;
            unit: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        quantity: number;
        reserved: number;
        minStock: number | null;
        maxStock: number | null;
        location: string | null;
        batch: string | null;
        serial: string | null;
        expiryDate: Date | null;
        warehouseId: string;
    })[]>;
}
