import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateExpenseItemDTO, UpdateExpenseItemDTO } from './dto';
import { ExpenseItem } from './models/expense-item.model';
import { InjectModel } from '@nestjs/sequelize';
import { Receipt } from '../receipts/models/receipt.model';
import { AppError } from 'src/common/constants/errors';

@Injectable()
export class ExpenseItemsService {
  constructor(
    @InjectModel(ExpenseItem) private readonly expenseItemRepository: typeof ExpenseItem,
    @InjectModel(Receipt) private readonly receiptRepository: typeof Receipt,
  ) {}

  async createExpenseItem(dto: CreateExpenseItemDTO, userId: number): Promise<ExpenseItem> {
    const receipt = await this.receiptRepository.findOne({
      where: { id: dto.receiptId, userId: userId }
    });

    if (!receipt) {
      throw new ForbiddenException(AppError.NO_ACCESS);
    }

    const expenseItem = await this.expenseItemRepository.create({
      name: dto.name,
      amount: dto.amount,
      receiptId: dto.receiptId,
      categoryId: dto.categoryId
    });

    return expenseItem;
  }

  async getExpenseItemsByReceiptId(receiptId: number, userId: number): Promise<ExpenseItem[]> {
    const receipt = await this.receiptRepository.findOne({
      where: { id: receiptId, userId: userId }
    });

    if (!receipt) {
      throw new ForbiddenException(AppError.NO_ACCESS);
    }

    const expenseItems = await this.expenseItemRepository.findAll({
      where: { receiptId: receiptId }
    });

    return expenseItems;
  }

  async getExpenseItemById(id: number, userId: number): Promise<ExpenseItem> {
    const expenseItem = await this.expenseItemRepository.findOne({
      where: { id },
      include: [
        {
          model: Receipt,
          where: { userId },
          required: true
        }
      ]
    });

    if (!expenseItem) {
      throw new NotFoundException(AppError.NOT_FOUND_EXPENSE_ITEM);
    }

    return expenseItem;
  }

  async deleteExpenseItem(id: number, userId: number): Promise<{ message: string }> {
    const expenseItem = await this.getExpenseItemById(id, userId);
    
    if (!expenseItem) {
      throw new NotFoundException(AppError.NOT_FOUND_EXPENSE_ITEM);
    }
    
    await this.expenseItemRepository.destroy({
      where: { id }
    });
    
    return { message: 'Expense item successfully deleted' };
  }
  async updateExpenseItem(
    id: number, 
    dto: UpdateExpenseItemDTO, 
    userId: number, 
    isFullUpdate: boolean
  ): Promise<ExpenseItem> {
    const expenseItem = await this.getExpenseItemById(id, userId);
    if (!expenseItem) {
      throw new NotFoundException(AppError.NOT_FOUND_EXPENSE_ITEM);
    }
    if (dto.receiptId && dto.receiptId !== expenseItem.receiptId) {
      const newReceipt = await this.receiptRepository.findOne({
        where: { id: dto.receiptId, userId }
      });
      
      if (!newReceipt) {
        throw new ForbiddenException(AppError.NO_ACCESS);
      }
    }
    if (isFullUpdate && (!dto.name || dto.amount === undefined || !dto.receiptId)) {
      throw new ForbiddenException('All required fields must be provided for full update');
    }
    await expenseItem.update(dto);
    return this.getExpenseItemById(id, userId);
  }
}