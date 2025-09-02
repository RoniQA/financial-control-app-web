"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        return this.prisma.user.create({
            data: createUserDto,
            include: {
                company: true,
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }
    async findAll(companyId) {
        return this.prisma.user.findMany({
            where: {
                companyId,
                deletedAt: null,
            },
            include: {
                company: true,
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                company: true,
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        return user;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                company: true,
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }
    async update(id, updateUserDto) {
        await this.findById(id);
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            include: {
                company: true,
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }
    async remove(id) {
        await this.findById(id);
        return this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async assignRole(userId, roleId) {
        return this.prisma.userRole.create({
            data: {
                userId,
                roleId,
            },
        });
    }
    async removeRole(userId, roleId) {
        return this.prisma.userRole.delete({
            where: {
                userId_roleId: {
                    userId,
                    roleId,
                },
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map