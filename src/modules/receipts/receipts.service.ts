import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReceiptDTO, UpdateReceiptDTO, CreateReceiptFromImageDTO } from './dto';
import { Receipt } from './models/receipt.model';
import { InjectModel } from '@nestjs/sequelize';
import { AppError } from 'src/common/constants/errors';
import { OpenAIService } from '../ai/openai.service';
import { ExpenseItem } from '../expense-items/models/expense-item.model';
import { Category } from '../categories/models/category.model';

@Injectable()
export class ReceiptsService {
    constructor(
      @InjectModel(Receipt) private readonly ReceiptRepository: typeof Receipt,
      @InjectModel(ExpenseItem) private readonly ExpenseItemRepository: typeof ExpenseItem,
      @InjectModel(Category) private readonly CategoryRepository: typeof Category,
      private readonly openaiService: OpenAIService
    ) {}

    async createReceipt(dto: CreateReceiptDTO, userId: number): Promise<Receipt> {
      const receipt = await this.ReceiptRepository.create({
        merchantName: dto.merchantName,
        totalAmount: dto.totalAmount,
        purchaseDate: dto.purchaseDate,
        imageUrl: dto.imageUrl,
        userId: userId
      });
      
      return receipt;
    }
  
    async getAllReceipts(userId: number): Promise<Receipt[]> {
      const receipts = await this.ReceiptRepository.findAll({
        where: { userId: userId },
        include: [{ model: ExpenseItem, include: [Category] }]
      });
      return receipts;
    }

    async getReceiptById(id: number, userId: number): Promise<Receipt> {
      const receipt = await this.ReceiptRepository.findOne({
        where: { id: id, userId: userId },
        include: [{ model: ExpenseItem, include: [Category] }]
      });
      
      if (!receipt) {
        throw new NotFoundException(AppError.NOT_FOUND_RECEIPT);
      }
      
      return receipt;
    }

    async updateReceipt(id: number, dto: UpdateReceiptDTO, userId: number): Promise<Receipt> {
      const receipt = await this.ReceiptRepository.findOne({
        where: { id: id, userId: userId }
      });
      
      if (!receipt) {
        throw new NotFoundException(AppError.NOT_FOUND_RECEIPT);
      }
      
      await receipt.update({
        merchantName: dto.merchantName ?? receipt.merchantName,
        totalAmount: dto.totalAmount ?? receipt.totalAmount,
        purchaseDate: dto.purchaseDate ?? receipt.purchaseDate,
        imageUrl: dto.imageUrl ?? receipt.imageUrl
      });
      
      return this.getReceiptById(receipt.id, userId);
    }

    async deleteReceipt(id: number, userId: number) {
      const receipt = await this.ReceiptRepository.findOne({
        where: { id: id, userId: userId }
      });
      
      if (!receipt) {
        throw new NotFoundException(AppError.NOT_FOUND_RECEIPT);
      }
      
      await receipt.destroy();
      
      return true;
    }

    async createReceiptFromImage(dto: CreateReceiptFromImageDTO, userId: number): Promise<Receipt> {
     
      const parsedData = await this.openaiService.parseReceiptFromImage(dto.imageUrl);
      
      
      if (parsedData.error) {
        throw new Error(`Failed to parse receipt: ${parsedData.error}`);
      }
      
      const receiptData = parsedData.receipt;
      
     
      const receipt = await this.ReceiptRepository.create({
        merchantName: receiptData.merchant,
        totalAmount: this.calculateTotalAmount(receiptData.expenses_attributes),
        purchaseDate: new Date(receiptData.purchased_at),
        imageUrl: dto.imageUrl,
        userId: userId
      });
      
     
      for (const expenseData of receiptData.expenses_attributes) {
       
        let category = await this.CategoryRepository.findOne({
          where: { name: expenseData.category }
        });
        
        if (!category) {
          category = await this.CategoryRepository.create({
            name: expenseData.category
          });
        }
        
       
        await this.ExpenseItemRepository.create({
          name: expenseData.name,
          amount: expenseData.amount,
          receiptId: receipt.id,
          categoryId: category.id
        });
      }
      
     
      return this.getReceiptById(receipt.id, userId);
    }
    
    private calculateTotalAmount(expenses): number {
      return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }
}