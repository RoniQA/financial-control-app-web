import { PrismaService } from '../../database/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createCompanyDto: CreateCompanyDto): Promise<{
        id: string;
        cnpj: string;
        name: string;
        ie: string | null;
        email: string;
        phone: string | null;
        address: import("@prisma/client/runtime/library").JsonValue | null;
        fiscalConfig: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findAll(): Promise<{
        id: string;
        cnpj: string;
        name: string;
        ie: string | null;
        email: string;
        phone: string | null;
        address: import("@prisma/client/runtime/library").JsonValue | null;
        fiscalConfig: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        cnpj: string;
        name: string;
        ie: string | null;
        email: string;
        phone: string | null;
        address: import("@prisma/client/runtime/library").JsonValue | null;
        fiscalConfig: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findByCnpj(cnpj: string): Promise<{
        id: string;
        cnpj: string;
        name: string;
        ie: string | null;
        email: string;
        phone: string | null;
        address: import("@prisma/client/runtime/library").JsonValue | null;
        fiscalConfig: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<{
        id: string;
        cnpj: string;
        name: string;
        ie: string | null;
        email: string;
        phone: string | null;
        address: import("@prisma/client/runtime/library").JsonValue | null;
        fiscalConfig: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        cnpj: string;
        name: string;
        ie: string | null;
        email: string;
        phone: string | null;
        address: import("@prisma/client/runtime/library").JsonValue | null;
        fiscalConfig: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
