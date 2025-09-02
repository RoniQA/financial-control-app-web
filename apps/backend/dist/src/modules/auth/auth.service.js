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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../../database/prisma.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.prisma = prisma;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw new common_1.UnauthorizedException('Usuário bloqueado temporariamente');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            await this.incrementFailedLogins(user.id);
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        await this.resetFailedLogins(user.id);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        const { password: _, ...result } = user;
        return result;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        const payload = {
            sub: user.id,
            email: user.email,
            companyId: user.companyId,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                companyId: user.companyId,
            },
        };
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Email já está em uso');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                ...registerDto,
                password: hashedPassword,
            },
        });
        const { password: _, ...result } = user;
        return result;
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.usersService.findById(payload.sub);
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('Token inválido');
            }
            const newPayload = {
                sub: user.id,
                email: user.email,
                companyId: user.companyId,
            };
            const newAccessToken = this.jwtService.sign(newPayload);
            const newRefreshToken = this.jwtService.sign(newPayload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
            });
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Token inválido');
        }
    }
    async incrementFailedLogins(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            return;
        const failedLogins = user.failedLogins + 1;
        const maxAttempts = 5;
        const lockTime = 30 * 60 * 1000;
        const updateData = {
            failedLogins,
        };
        if (failedLogins >= maxAttempts) {
            updateData.lockedUntil = new Date(Date.now() + lockTime);
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
    }
    async resetFailedLogins(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                failedLogins: 0,
                lockedUntil: null,
            },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map