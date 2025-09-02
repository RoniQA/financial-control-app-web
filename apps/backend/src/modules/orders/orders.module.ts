import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { InventoryModule } from '../inventory/inventory.module';
import { FinancialModule } from '../financial/financial.module';

@Module({
  imports: [
    forwardRef(() => InventoryModule),
    forwardRef(() => FinancialModule),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}

