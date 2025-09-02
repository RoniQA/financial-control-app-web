import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            companyId: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        id: string;
        email: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
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
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(req: any): Promise<any>;
}
