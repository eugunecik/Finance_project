import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ExpenseItem } from '../expense-items/models/expense-item.model';

@Module({
  imports: [SequelizeModule.forFeature([Category, ExpenseItem])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule {}