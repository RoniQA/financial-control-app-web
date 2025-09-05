import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('test')
  @ApiOperation({ summary: 'Teste de conectividade' })
  async test() {
    console.log('🔍 Auth test endpoint called');
    return {
      message: 'Auth service is working',
      timestamp: new Date().toISOString()
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto) {
    console.log('📥 Login request received:', { email: loginDto.email });
    
    try {
      const result = await this.authService.login(loginDto);
      
      console.log('📤 Login response:', {
        hasUser: !!result.user,
        hasAccessToken: !!result.accessToken,
        hasRefreshToken: !!result.refreshToken,
        userDetails: result.user ? {
          id: result.user.id,
          email: result.user.email,
          companyId: result.user.companyId
        } : null
      });

      // Validar a resposta antes de enviar
      if (!result.user || !result.accessToken || !result.refreshToken) {
        console.error('❌ Invalid login response:', result);
        throw new Error('Invalid login response structure');
      }

      return result;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Registro de novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renovar token de acesso' })
  @ApiResponse({ status: 200, description: 'Token renovado com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário' })
  async getProfile(@Request() req) {
    return req.user;
  }
}

