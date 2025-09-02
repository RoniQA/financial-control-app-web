export declare class CreateStockMoveDto {
    type: string;
    productId: string;
    warehouseId: string;
    quantity: number;
    unitCost?: number;
    totalCost?: number;
    reference?: string;
    referenceId?: string;
    batch?: string;
    serial?: string;
    reason?: string;
}
