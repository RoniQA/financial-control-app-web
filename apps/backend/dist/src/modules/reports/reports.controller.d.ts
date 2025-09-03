import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getSalesReport(startDate?: string, endDate?: string): Promise<{
        number: string;
        id: string;
        type: string;
        total: number;
        createdAt: Date;
        partner: {
            name: string;
        };
    }[]>;
    getPurchaseReport(startDate?: string, endDate?: string): Promise<{
        number: string;
        id: string;
        type: string;
        total: number;
        createdAt: Date;
        partner: {
            name: string;
        };
    }[]>;
    getInventoryReport(): Promise<({
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
    getFinancialReport(startDate?: string, endDate?: string): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PaymentGroupByOutputType, ("type" | "method")[]> & {
        _count: {
            id: number;
        };
        _sum: {
            amount: number;
        };
    })[]>;
    getDashboardData(): Promise<{
        totals: {
            products: number;
            partners: number;
            orders: number;
            invoices: number;
        };
        recentOrders: ({
            partner: {
                id: string;
                type: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                companyId: string;
                name: string;
                document: string;
                ie: string | null;
                im: string | null;
                email: string | null;
                phone: string | null;
                address: import("@prisma/client/runtime/library").JsonValue | null;
                isActive: boolean;
            };
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                companyId: string;
                email: string;
                phone: string | null;
                isActive: boolean;
                password: string;
                firstName: string;
                lastName: string;
                lastLogin: Date | null;
                failedLogins: number;
                lockedUntil: Date | null;
                mfaEnabled: boolean;
                mfaSecret: string | null;
            };
        } & {
            number: string;
            id: string;
            type: string;
            status: string;
            partnerId: string | null;
            userId: string;
            total: number;
            discount: number;
            tax: number;
            notes: string | null;
            orderDate: Date;
            validUntil: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            companyId: string;
        })[];
        lowStockProducts: ({
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
    }>;
}
