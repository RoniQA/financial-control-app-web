import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getSalesReport(startDate?: string, endDate?: string): Promise<{
        number: string;
        id: string;
        createdAt: Date;
        type: string;
        partner: {
            name: string;
        };
        total: number;
    }[]>;
    getPurchaseReport(startDate?: string, endDate?: string): Promise<{
        number: string;
        id: string;
        createdAt: Date;
        type: string;
        partner: {
            name: string;
        };
        total: number;
    }[]>;
    getInventoryReport(): Promise<({
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
            user: {
                id: string;
                email: string;
                phone: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                password: string;
                firstName: string;
                lastName: string;
                isActive: boolean;
                lastLogin: Date | null;
                failedLogins: number;
                lockedUntil: Date | null;
                mfaEnabled: boolean;
                mfaSecret: string | null;
                companyId: string;
            };
            partner: {
                id: string;
                name: string;
                ie: string | null;
                email: string | null;
                phone: string | null;
                address: import("@prisma/client/runtime/library").JsonValue | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                isActive: boolean;
                companyId: string;
                type: string;
                document: string;
                im: string | null;
            };
        } & {
            number: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            companyId: string;
            userId: string;
            type: string;
            discount: number;
            tax: number;
            total: number;
            notes: string | null;
            status: string;
            partnerId: string | null;
            validUntil: Date | null;
            orderDate: Date;
        })[];
        lowStockProducts: ({
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
    }>;
}
