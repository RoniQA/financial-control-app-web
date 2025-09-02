import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
        stocks: ({
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
        })[];
        prices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            costPrice: number | null;
            avgCost: number | null;
            markup: number | null;
            salePrice: number;
            validFrom: Date;
            validTo: Date | null;
            productId: string;
        }[];
    } & {
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
    }>;
    findAll(filters: any): Promise<({
        stocks: ({
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
        })[];
        prices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            costPrice: number | null;
            avgCost: number | null;
            markup: number | null;
            salePrice: number;
            validFrom: Date;
            validTo: Date | null;
            productId: string;
        }[];
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        stocks: ({
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
        })[];
        prices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            costPrice: number | null;
            avgCost: number | null;
            markup: number | null;
            salePrice: number;
            validFrom: Date;
            validTo: Date | null;
            productId: string;
        }[];
    } & {
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
    }>;
    findBySku(sku: string): Promise<{
        stocks: ({
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
        })[];
        prices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            costPrice: number | null;
            avgCost: number | null;
            markup: number | null;
            salePrice: number;
            validFrom: Date;
            validTo: Date | null;
            productId: string;
        }[];
    } & {
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
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        stocks: ({
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
        })[];
        prices: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            costPrice: number | null;
            avgCost: number | null;
            markup: number | null;
            salePrice: number;
            validFrom: Date;
            validTo: Date | null;
            productId: string;
        }[];
    } & {
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
    }>;
    remove(id: string): Promise<{
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
    }>;
    updatePrice(productId: string, priceData: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        costPrice: number | null;
        avgCost: number | null;
        markup: number | null;
        salePrice: number;
        validFrom: Date;
        validTo: Date | null;
        productId: string;
    }>;
    getStock(productId: string, warehouseId?: string): Promise<({
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
