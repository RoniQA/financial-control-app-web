export declare class CreatePaymentDto {
    type: string;
    method: string;
    amount: number;
    description?: string;
    reference?: string;
    referenceId?: string;
    dueDate?: string;
    fees?: number;
    companyId: string;
    partnerId?: string;
    userId: string;
    invoiceId?: string;
    bankAccountId?: string;
}
