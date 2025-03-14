import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExpenseItemsController } from './expense-items.controller';
import { ExpenseItemsService } from './expense-items.service';
import { ExpenseItem } from './models/expense-item.model';
import { Receipt } from '../receipts/models/receipt.model';

@Module({
  imports: [SequelizeModule.forFeature([ExpenseItem, Receipt])],
  controllers: [ExpenseItemsController],
  providers: [ExpenseItemsService],
  exports: [ExpenseItemsService]
})
export class ExpenseItemsModule {}