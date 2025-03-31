import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Receipt } from '../receipts/models/receipt.model';
import { ExpenseItem } from '../expense-items/models/expense-item.model';
import { Category } from '../categories/models/category.model';
import { User } from '../users/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Receipt, ExpenseItem, Category, User]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchesModule {}