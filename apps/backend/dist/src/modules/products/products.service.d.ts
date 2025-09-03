import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto): Promise<{
        prices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            costPrice: number | null;
            avgCost: number | null;
            markup: number | null;
            salePrice: number;
            validFrom: Date;
            validTo: Date | null;
        }[];
        stocks: ({
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
        })[];
    } & {
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
    }>;
    findAll(companyId: string, filters?: any): Promise<({
        prices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            costPrice: number | null;
            avgCost: number | null;
            markup: number | null;
            salePrice: number;
            validFrom: Date;
            validTo: Date | null;
        }[];
        stocks: ({
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
        })[];
    } & {
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
    })[]>;
    findById(id: string): Promise<{
        prices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            costPrice: number | null;
            avgCost: number | null;
            markup: number | null;
            salePrice: number;
            validFrom: Date;
            validTo: Date | null;
        }[];
        stocks: ({
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
        })[];
    } & {
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
    }>;
    findBySku(companyId: string, sku: string): Promise<{
        prices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            costPrice: number | null;
            avgCost: number | null;
            markup: number | null;
            salePrice: number;
            validFrom: Date;
            validTo: Date | null;
        }[];
        stocks: ({
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
        })[];
    } & {
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
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        prices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            costPrice: number | null;
            avgCost: number | null;
            markup: number | null;
            salePrice: number;
            validFrom: Date;
            validTo: Date | null;
        }[];
        stocks: ({
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
        })[];
    } & {
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
    }>;
    remove(id: string): Promise<{
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
    }>;
    updatePrice(productId: string, priceData: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        costPrice: number | null;
        avgCost: number | null;
        markup: number | null;
        salePrice: number;
        validFrom: Date;
        validTo: Date | null;
    }>;
    getStock(productId: string, warehouseId?: string): Promise<({
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
