import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        company: {
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
        };
        roles: ({
            role: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
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
    }>;
    findAll(): Promise<({
        company: {
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
        };
        roles: ({
            role: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
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
    })[]>;
    findOne(id: string): Promise<{
        company: {
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
        };
        roles: ({
            role: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
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
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        company: {
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
        };
        roles: ({
            role: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
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
    }>;
    remove(id: string): Promise<{
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
