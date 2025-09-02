export declare class CreateOrderItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    tax?: number;
    total: number;
    notes?: string;
}
export declare class CreateOrderDto {
    number: string;
    type: string;
    status: string;
    partnerId?: string;
    userId: string;
    total?: number;
    discount?: number;
    tax?: number;
    notes?: string;
    validUntil?: string;
    orderDate?: string;
    items: CreateOrderItemDto[];
}
