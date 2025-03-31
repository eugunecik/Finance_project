import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { ExpenseItem } from '../expense-items/models/expense-item.model';
import { Receipt } from '../receipts/models/receipt.model';
import { Category } from '../categories/models/category.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ExpenseItem, Receipt, Category]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}