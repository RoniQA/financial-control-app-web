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
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        let databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            databaseUrl = process.env.POSTGRES_URL ||
                process.env.POSTGRES_DATABASE_URL ||
                process.env.DATABASE_CONNECTION_STRING ||
                process.env.DB_URL;
        }
        console.log('🔍 Database environment variables:');
        Object.keys(process.env).forEach(key => {
            if (key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('DB')) {
                const value = process.env[key];
                if (value && value.includes('://')) {
                    const maskedValue = value.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
                    console.log(`  - ${key}:`, maskedValue);
                }
                else {
                    console.log(`  - ${key}:`, value ? '***' : 'undefined');
                }
            }
        });
        if (databaseUrl) {
            const maskedUrl = databaseUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
            console.log('🔗 Using DATABASE_URL:', maskedUrl);
        }
        else {
            console.error('❌ No DATABASE_URL found in any environment variable');
            console.error('❌ Available environment variables:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('POSTGRES') || k.includes('DB')));
        }
        super({
            log: ['query', 'info', 'warn', 'error'],
            datasources: {
                db: {
                    url: databaseUrl,
                },
            },
        });
    }
    async onModuleInit() {
        try {
            console.log('🔄 Attempting to connect to database...');
            await this.$connect();
            console.log('✅ Prisma Client connected successfully');
        }
        catch (error) {
            console.error('❌ Failed to connect to database:', error);
            throw error;
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    async cleanDatabase() {
        if (process.env.NODE_ENV === 'production')
            return;
        const models = Reflect.ownKeys(this).filter(key => key[0] !== '_');
        return Promise.all(models.map((modelKey) => {
            const model = this[modelKey];
            return model.deleteMany();
        }));
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map