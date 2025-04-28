import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ExpenseItem } from '../expense-items/models/expense-item.model';
import { Receipt } from '../receipts/models/receipt.model';
import { Category } from '../categories/models/category.model';
import { Family } from '../families/models/family.model';
import { User } from '../users/models/user.model';
import { Sequelize } from 'sequelize-typescript';
import { AppError } from 'src/common/constants/errors';

interface FamilyMemberExpenseResult {
  userId: number;
  totalAmount: string;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(ExpenseItem) private readonly expenseItemRepository: typeof ExpenseItem,
    @InjectModel(Receipt) private readonly receiptRepository: typeof Receipt,
    @InjectModel(Category) private readonly categoryRepository: typeof Category,
    @InjectModel(Family) private readonly familyRepository: typeof Family,
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async getExpensesPerCategory(startDate: string, endDate: string, userId: number) {
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
      throw new BadRequestException('Invalid date format. Use ISO format (e.g., 2025-01-01).');
    }

    const result = await this.expenseItemRepository.findAll({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('ExpenseItem.amount')), 'totalAmount']],
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
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
      throw new BadRequestException('Invalid date format. Use ISO format (e.g., 2025-01-01).');
    }

    const result = await this.expenseItemRepository.findAll({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('ExpenseItem.amount')), 'totalAmount']],
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

  async getFamilyExpensesPerCategory(startDate: string, endDate: string, userId: number) {
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
      throw new BadRequestException('Invalid date format. Use ISO format (e.g., 2025-01-01).');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.familyId) {
      throw new NotFoundException(AppError.FAMILY_NOT_FOUND_OR_NOT_MEMBER);
    }

    const family = await this.familyRepository.findOne({ where: { id: user.familyId } });
    if (!family) {
      throw new NotFoundException(AppError.FAMILY_NOT_FOUND);
    }

    const memberIds = family.members || [];
    if (memberIds.length === 0) {
      return { data: [] };
    }

    const result = await this.expenseItemRepository.findAll({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('ExpenseItem.amount')), 'totalAmount']],
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
            userId: { [Op.in]: memberIds },
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

  async getFamilyTotalExpenses(startDate: string, endDate: string, userId: number) {
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
      throw new BadRequestException('Invalid date format. Use ISO format (e.g., 2025-01-01).');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.familyId) {
      throw new NotFoundException(AppError.FAMILY_NOT_FOUND_OR_NOT_MEMBER);
    }

    const family = await this.familyRepository.findOne({ where: { id: user.familyId } });
    if (!family) {
      throw new NotFoundException(AppError.FAMILY_NOT_FOUND);
    }

    const memberIds = family.members || [];
    if (memberIds.length === 0) {
      return { totalExpenses: '0.00' };
    }

    const result = await this.expenseItemRepository.findAll({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('ExpenseItem.amount')), 'totalAmount']],
      include: [
        {
          model: Receipt,
          attributes: [],
          where: {
            userId: { [Op.in]: memberIds },
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

  async getFamilyMemberExpenses(startDate: string, endDate: string, userId: number) {
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
      throw new BadRequestException('Invalid date format. Use ISO format (e.g., 2025-01-01).');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.familyId) {
      throw new NotFoundException(AppError.FAMILY_NOT_FOUND_OR_NOT_MEMBER);
    }

    const family = await this.familyRepository.findOne({ where: { id: user.familyId } });
    if (!family) {
      throw new NotFoundException(AppError.FAMILY_NOT_FOUND);
    }

    const memberIds = family.members || [];
    if (memberIds.length === 0) {
      return { data: [] };
    }

    const members = await this.userRepository.findAll({
      where: { id: { [Op.in]: memberIds } },
      attributes: ['id', 'firstName', 'username'],
    });

    const result = await this.expenseItemRepository.findAll({
      attributes: [
        [Sequelize.col('receipt.userId'), 'userId'],
        [Sequelize.fn('SUM', Sequelize.col('ExpenseItem.amount')), 'totalAmount'],
      ],
      include: [
        {
          model: Receipt,
          attributes: [],
          where: {
            userId: { [Op.in]: memberIds },
            purchaseDate: {
              [Op.between]: [new Date(startDate), new Date(endDate)],
            },
          },
          required: true,
        },
      ],
      group: ['receipt.userId'],
      raw: true,
    }) as unknown as FamilyMemberExpenseResult[];

    const memberExpenses = members.map(member => {
      const expense = result.find(r => r.userId === member.id);
      return {
        userId: member.id,
        firstName: member.firstName,
        username: member.username,
        totalAmount: expense ? parseFloat(expense.totalAmount) : 0,
      };
    });

    return {
      data: memberExpenses,
    };
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
}