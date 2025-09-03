import { InventoryService } from './inventory.service';
import { CreateStockMoveDto } from './dto/create-stock-move.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    createStockMove(createStockMoveDto: CreateStockMoveDto): Promise<{
        product: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            companyId: string;
            name: string;
            isActive: boolean;
            sku: string;
            description: string | null;
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
        warehouse: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            companyId: string;
            name: string;
            address: import("@prisma/client/runtime/library").JsonValue | null;
            isActive: boolean;
            code: string;
        };
    } & {
        id: string;
        type: string;
        createdAt: Date;
        productId: string;
        warehouseId: string;
        quantity: number;
        batch: string | null;
        serial: string | null;
        reference: string | null;
        referenceId: string | null;
        unitCost: number | null;
        totalCost: number | null;
        reason: string | null;
    }>;
    getStockMoves(productId?: string, warehouseId?: string): Promise<({
        product: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            companyId: string;
            name: string;
            isActive: boolean;
            sku: string;
            description: string | null;
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
        warehouse: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            companyId: string;
            name: string;
            address: import("@prisma/client/runtime/library").JsonValue | null;
            isActive: boolean;
            code: string;
        };
    } & {
        id: string;
        type: string;
        createdAt: Date;
        productId: string;
        warehouseId: string;
        quantity: number;
        batch: string | null;
        serial: string | null;
        reference: string | null;
        referenceId: string | null;
        unitCost: number | null;
        totalCost: number | null;
        reason: string | null;
    })[]>;
    getStockSummary(): Promise<({
        product: {
            id: string;
            name: string;
            sku: string;
            unit: string;
        };
        warehouse: {
            id: string;
            name: string;
            code: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        warehouseId: string;
        quantity: number;
        reserved: number;
        minStock: number | null;
        maxStock: number | null;
        location: string | null;
        batch: string | null;
        serial: string | null;
        expiryDate: Date | null;
    })[]>;
}
