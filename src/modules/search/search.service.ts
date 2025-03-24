import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, fn, col, where } from 'sequelize';
import { Receipt } from '../receipts/models/receipt.model';
import { ExpenseItem } from '../expense-items/models/expense-item.model';
import { Category } from '../categories/models/category.model';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Receipt)
    private receiptModel: typeof Receipt,
    @InjectModel(ExpenseItem)
    private expenseItemModel: typeof ExpenseItem,
  ) {}

  async searchReceipts(searchTerm: string, userId: number) {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const normalizedTerm = `%${searchTerm.toLowerCase()}%`;

   
    const directMatches = await this.receiptModel.findAll({
      where: {
        userId,
        ...this.getCaseInsensitiveCriteria('Receipt.merchantName', normalizedTerm),
      },
      attributes: ['id'],
    });
    
  
    const expenseItemMatches = await this.expenseItemModel.findAll({
      where: this.getCaseInsensitiveCriteria('ExpenseItem.name', normalizedTerm),
      include: [
        {
          model: Receipt,
          where: { userId },
          attributes: ['id'],
        },
      ],
      attributes: ['receiptId'],
    });
    
 
    const categoryMatches = await this.expenseItemModel.findAll({
      include: [
        {
          model: Category,
          where: this.getCaseInsensitiveCriteria('category.name', normalizedTerm),
          required: true,
        },
        {
          model: Receipt,
          where: { userId },
          attributes: ['id'],
        },
      ],
      attributes: ['receiptId'],
    });
    
   
    const directMatchIds = directMatches.map(match => match.id);
    const expenseMatchIds = expenseItemMatches.map(match => match.receiptId);
    const categoryMatchIds = categoryMatches.map(match => match.receiptId);
    
    const allMatchingIds = [...new Set([...directMatchIds, ...expenseMatchIds, ...categoryMatchIds])];
    
    if (allMatchingIds.length === 0) {
      return [];
    }


    return this.receiptModel.findAll({
      where: {
        id: { [Op.in]: allMatchingIds },
        userId,
      },
      include: [
        {
          model: ExpenseItem,
          include: [
            {
              model: Category,
              required: false,
            },
          ],
          required: false,
        },
      ],
    });
  }

  
  private getCaseInsensitiveCriteria(fieldName: string, searchValue: string) {
    return {
      [Op.and]: [
        where(fn('LOWER', col(fieldName)), 'LIKE', searchValue)
      ]
    };
  }
}