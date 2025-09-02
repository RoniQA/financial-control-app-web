import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        company: {
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
        };
        roles: ({
            role: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                permissions: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            userId: string;
            roleId: string;
        })[];
    } & {
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
    }>;
    findAll(companyId: string): Promise<({
        company: {
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
        };
        roles: ({
            role: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                permissions: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            userId: string;
            roleId: string;
        })[];
    } & {
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
    })[]>;
    findById(id: string): Promise<{
        company: {
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
        };
        roles: ({
            role: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                permissions: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            userId: string;
            roleId: string;
        })[];
    } & {
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
    }>;
    findByEmail(email: string): Promise<{
        company: {
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
        };
        roles: ({
            role: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                permissions: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            userId: string;
            roleId: string;
        })[];
    } & {
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
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        company: {
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
        };
        roles: ({
            role: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                permissions: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            userId: string;
            roleId: string;
        })[];
    } & {
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
    }>;
    remove(id: string): Promise<{
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
    }>;
    assignRole(userId: string, roleId: string): Promise<{
        id: string;
        userId: string;
        roleId: string;
    }>;
    removeRole(userId: string, roleId: string): Promise<{
        id: string;
        userId: string;
        roleId: string;
    }>;
}
