import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log('🔍 Validating user:', { email });
    const user = await this.usersService.findByEmail(email);
    console.log('🔍 User found:', { 
      found: !!user, 
      isActive: user?.isActive,
      hasCompanyId: !!user?.companyId
    });
    
    if (!user || !user.isActive) {
      console.log('❌ User not found or inactive');
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Check if user is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      console.log('❌ User is locked until:', user.lockedUntil);
      throw new UnauthorizedException('Usuário bloqueado temporariamente');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔑 Password validation:', { isValid: isPasswordValid });
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      // Increment failed login attempts
      await this.incrementFailedLogins(user.id);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Reset failed login attempts on successful login
    await this.resetFailedLogins(user.id);
    
    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    console.log('🔐 Login attempt:', { email: loginDto.email });
    
    const user = await this.validateUser(loginDto.email, loginDto.password);
    console.log('✅ User validated:', { 
      id: user.id,
      email: user.email,
      companyId: user.companyId 
    });
    
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      companyId: user.companyId,
    };
    console.log('🔑 JWT payload:', payload);

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
    console.log('🎟️ Tokens generated:', { 
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken 
    });

    const response = {
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
    
    console.log('📤 Login response:', {
      hasUser: !!response.user,
      hasAccessToken: !!response.accessToken,
      hasRefreshToken: !!response.refreshToken,
      userDetails: {
        id: response.user.id,
        email: response.user.email,
        companyId: response.user.companyId
      }
    });

    return response;
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    
    if (existingUser) {
      throw new BadRequestException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    
    // Criar empresa padrão para o usuário
    const company = await this.prisma.company.create({
      data: {
        name: `${registerDto.firstName} ${registerDto.lastName} - Empresa`,
        cnpj: '00000000000000',
        ie: '000000000',
        email: registerDto.email,
        phone: registerDto.phone || '(11) 99999-9999',
        address: {
          street: '',
          number: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: ''
        }
      }
    });

    // Criar warehouse padrão para a empresa
    await this.prisma.warehouse.create({
      data: {
        name: 'Estoque Principal',
        code: 'MAIN',
        companyId: company.id,
        address: {
          street: '',
          number: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: ''
        }
      }
    });

    // Criar role de admin se não existir
    let adminRole = await this.prisma.role.findFirst({
      where: { name: 'admin' }
    });
    
    if (!adminRole) {
      adminRole = await this.prisma.role.create({
        data: {
          name: 'admin',
          description: 'Administrador do sistema',
          permissions: ['*']
        }
      });
    }
    
    const user = await this.prisma.user.create({
      data: {
        ...registerDto,
        password: hashedPassword,
        companyId: company.id,
      },
    });

    // Associar role de admin ao usuário
    await this.prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: adminRole.id
      }
    });

    const { password: _, ...result } = user;
    return result;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findById(payload.sub);
      
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Token inválido');
      }

      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        companyId: user.companyId,
      };

      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  private async incrementFailedLogins(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return;

    const failedLogins = user.failedLogins + 1;
    const maxAttempts = 5;
    const lockTime = 30 * 60 * 1000; // 30 minutes

    const updateData: any = {
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

  private async resetFailedLogins(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        failedLogins: 0,
        lockedUntil: null,
      },
    });
  }
}

