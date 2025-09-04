import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

// Core modules
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';

// Business modules
import { ProductsModule } from './modules/products/products.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { WarehousesModule } from './modules/warehouses/warehouses.module';
import { PartnersModule } from './modules/partners/partners.module';
import { OrdersModule } from './modules/orders/orders.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { FinancialModule } from './modules/financial/financial.module';
import { FiscalModule } from './modules/fiscal/fiscal.module';
import { ReportsModule } from './modules/reports/reports.module';

// Common modules
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Job queue
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),

    // Scheduling
    ScheduleModule.forRoot(),

    // Database
    DatabaseModule,

    // Common
    CommonModule,
    HealthModule,

    // Core modules
    AuthModule,
    UsersModule,
    CompaniesModule,

    // Business modules
    ProductsModule,
    InventoryModule,
    WarehousesModule,
    PartnersModule,
    OrdersModule,
    InvoicesModule,
    FinancialModule,
    FiscalModule,
    ReportsModule,
  ],
})
export class AppModule {}

