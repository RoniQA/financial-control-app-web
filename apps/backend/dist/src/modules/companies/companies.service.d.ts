import { PrismaService } from '../../database/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createCompanyDto: CreateCompanyDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        ie: string | null;
        email: string;
        phone: string | null;
        address: import("@prisma/client/runtime/library").JsonValue | null;
        cnpj: string;
        fiscalConfig: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        ie: string | null;
        email: string;
        phone: string | null;
        address: import("@prisma/client/runtime/library").JsonValue | null;
        cnpj: string;
        fiscalConfig: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        ie: string | null;
        email: string;
        phone: string | null;
        address: import("@prisma/client/runtime/library").JsonValue | null;
        cnpj: string;
        fiscalConfig: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findByCnpj(cnpj: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        ie: string | null;
        email: string;
        phone: string | null;
        address: import("@prisma/client/runtime/library").JsonValue | null;
        cnpj: string;
        fiscalConfig: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        ie: string | null;
        email: string;
        phone: string | null;
        address: import("@prisma/client/runtime/library").JsonValue | null;
        cnpj: string;
        fiscalConfig: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        ie: string | null;
        email: string;
        phone: string | null;
        address: import("@prisma/client/runtime/library").JsonValue | null;
        cnpj: string;
        fiscalConfig: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
