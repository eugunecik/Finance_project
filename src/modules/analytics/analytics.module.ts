import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { ExpenseItem } from '../expense-items/models/expense-item.model';
import { Receipt } from '../receipts/models/receipt.model';
import { Category } from '../categories/models/category.model';
import { Family } from '../families/models/family.model';
import { User } from '../users/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ExpenseItem, Receipt, Category, Family, User]),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}