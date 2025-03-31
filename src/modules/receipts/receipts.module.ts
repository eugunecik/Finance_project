// src/receipts/receipts.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';
import { Receipt } from './models/receipt.model';
import { ExpenseItem } from '../expense-items/models/expense-item.model';
import { Category } from '../categories/models/category.model';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Receipt, ExpenseItem, Category]),
    AIModule,
  ],
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
  exports: [ReceiptsService],
})
export class ReceiptsModule {}