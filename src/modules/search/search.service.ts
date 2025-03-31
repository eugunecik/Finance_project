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
    private readonly receiptModel: typeof Receipt,
    @InjectModel(ExpenseItem)
    private readonly expenseItemModel: typeof ExpenseItem,
  ) {}

  async searchReceipts(searchTerm: string, userId: number): Promise<Receipt[]> {
    if (!searchTerm?.trim()) {
      return [];
    }

    const normalizedTerm = `%${searchTerm.toLowerCase()}%`;
    const matchingIds = await this.findMatchingReceiptIds(normalizedTerm, userId);
    
    if (!matchingIds.length) {
      return [];
    }

    return this.fetchReceiptsWithDetails(matchingIds, userId);
  }

  private async findMatchingReceiptIds(normalizedTerm: string, userId: number): Promise<number[]> {
    const [directMatches, expenseItemMatches, categoryMatches] = await Promise.all([
      this.findDirectMatches(normalizedTerm, userId),
      this.findExpenseItemMatches(normalizedTerm, userId),
      this.findCategoryMatches(normalizedTerm, userId),
    ]);

    const directMatchIds = directMatches.map(match => match.id);
    const expenseMatchIds = expenseItemMatches.map(match => match.receiptId);
    const categoryMatchIds = categoryMatches.map(match => match.receiptId);
    

    return [...new Set([...directMatchIds, ...expenseMatchIds, ...categoryMatchIds])];
  }

  private async findDirectMatches(normalizedTerm: string, userId: number): Promise<Receipt[]> {
    return this.receiptModel.findAll({
      where: {
        userId,
        ...this.getCaseInsensitiveCriteria('Receipt.merchantName', normalizedTerm),
      },
      attributes: ['id'],
    });
  }

  private async findExpenseItemMatches(normalizedTerm: string, userId: number): Promise<ExpenseItem[]> {
    return this.expenseItemModel.findAll({
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
  }

  private async findCategoryMatches(normalizedTerm: string, userId: number): Promise<ExpenseItem[]> {
    return this.expenseItemModel.findAll({
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
  }

  private async fetchReceiptsWithDetails(receiptIds: number[], userId: number): Promise<Receipt[]> {
    return this.receiptModel.findAll({
      where: {
        id: { [Op.in]: receiptIds },
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