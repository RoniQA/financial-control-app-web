export declare class CreateInvoiceItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    tax?: number;
    total: number;
    cfop?: string;
    ncm?: string;
    cest?: string;
    csosn?: string;
    icms?: number;
    pis?: number;
    cofins?: number;
    ipi?: number;
}
export declare class CreateInvoiceDto {
    number: string;
    type: string;
    status: string;
    partnerId?: string;
    userId: string;
    orderId?: string;
    total?: number;
    tax?: number;
    dueDate?: string;
    notes?: string;
    items: CreateInvoiceItemDto[];
}
