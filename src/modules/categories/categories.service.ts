import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dto';
import { Category } from './models/category.model';
import { InjectModel } from '@nestjs/sequelize';
import { AppError } from 'src/common/constants/errors';
import { ExpenseItem } from '../expense-items/models/expense-item.model';
import { Receipt } from '../receipts/models/receipt.model';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private readonly categoryRepository: typeof Category,
    @InjectModel(ExpenseItem) private readonly expenseItemRepository: typeof ExpenseItem,
  ) {}

  async createCategory(dto: CreateCategoryDTO): Promise<Category> {
    const category = await this.categoryRepository.create({
      name: dto.name
    });

    return category;
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id }
    });

    if (!category) {
      throw new NotFoundException(AppError.NOT_FOUND_CATEGORY);
    }

    return category;
  }

  async getExpenseItemsByCategory(categoryId: number, userId: number): Promise<ExpenseItem[]> {
  
    await this.getCategoryById(categoryId);
    
    const expenseItems = await this.expenseItemRepository.findAll({
      where: { categoryId },
      include: [
        {
          model: Receipt,
          where: { userId },
          required: true
        }
      ]
    });
    
    return expenseItems;
  }

  async deleteCategory(id: number): Promise<{ message: string }> {
    
    await this.getCategoryById(id);
    
    await this.categoryRepository.destroy({
      where: { id }
    });
    
    return { message: 'Category successfully deleted' };
  }

  async updateCategory(
    id: number, 
    dto: UpdateCategoryDTO, 
    isFullUpdate: boolean
  ): Promise<Category> {
    const category = await this.getCategoryById(id);
    
    if (isFullUpdate && !dto.name) {
      throw new BadRequestException(AppError.WRONG_DATA);
    }
    
    await category.update(dto);
    
    return this.getCategoryById(id);
  }
}