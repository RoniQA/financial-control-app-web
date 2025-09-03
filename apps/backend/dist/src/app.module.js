"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const bull_1 = require("@nestjs/bull");
const schedule_1 = require("@nestjs/schedule");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const companies_module_1 = require("./modules/companies/companies.module");
const products_module_1 = require("./modules/products/products.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const partners_module_1 = require("./modules/partners/partners.module");
const orders_module_1 = require("./modules/orders/orders.module");
const invoices_module_1 = require("./modules/invoices/invoices.module");
const financial_module_1 = require("./modules/financial/financial.module");
const fiscal_module_1 = require("./modules/fiscal/fiscal.module");
const reports_module_1 = require("./modules/reports/reports.module");
const common_module_1 = require("./common/common.module");
const health_module_1 = require("./health/health.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            bull_1.BullModule.forRoot({
                redis: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT) || 6379,
                    password: process.env.REDIS_PASSWORD,
                },
            }),
            schedule_1.ScheduleModule.forRoot(),
            database_module_1.DatabaseModule,
            common_module_1.CommonModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            companies_module_1.CompaniesModule,
            products_module_1.ProductsModule,
            inventory_module_1.InventoryModule,
            partners_module_1.PartnersModule,
            orders_module_1.OrdersModule,
            invoices_module_1.InvoicesModule,
            financial_module_1.FinancialModule,
            fiscal_module_1.FiscalModule,
            reports_module_1.ReportsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map