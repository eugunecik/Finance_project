import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ExpenseItem } from '../expense-items/models/expense-item.model';
import { Receipt } from '../receipts/models/receipt.model';
import { Category } from '../categories/models/category.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(ExpenseItem) private readonly expenseItemRepository: typeof ExpenseItem,
    @InjectModel(Receipt) private readonly receiptRepository: typeof Receipt,
    @InjectModel(Category) private readonly categoryRepository: typeof Category,
  ) {}

  async getExpensesPerCategory(startDate: string, endDate: string, userId: number) {
    const result = await this.expenseItemRepository.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('ExpenseItem.amount')), 'totalAmount'],
      ],
      include: [
        {
          model: Category,
          attributes: ['name'],
          required: true,
        },
        {
          model: Receipt,
          attributes: [],
          where: {
            userId,
            purchaseDate: {
              [Op.between]: [new Date(startDate), new Date(endDate)],
            },
          },
          required: true,
        },
      ],
      group: ['category.id', 'category.name'], 
      raw: true,
    });

    return {
      data: result.map(item => ({
        category: item['category.name'],
        totalAmount: parseFloat(item['totalAmount']),
      })),
    };
  }

  async getTotalExpenses(startDate: string, endDate: string, userId: number) {
    const result = await this.expenseItemRepository.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('ExpenseItem.amount')), 'totalAmount']
      ],
      include: [
        {
          model: Receipt,
          attributes: [],
          where: {
            userId,
            purchaseDate: {
              [Op.between]: [new Date(startDate), new Date(endDate)],
            },
          },
          required: true,
        },
      ],
      raw: true,
    });

    const totalAmount = result.length > 0 ? result[0]['totalAmount'] : 0;
    
    return {
      totalExpenses: parseFloat(totalAmount?.toString() || '0').toFixed(2),
    };
  }
}