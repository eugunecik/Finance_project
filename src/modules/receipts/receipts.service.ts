import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReceiptDTO,UpdateReceiptDTO } from './dto';
import { Receipt } from './models/receipt.model';
import { InjectModel } from '@nestjs/sequelize';
import { AppError } from 'src/common/constants/errors';

@Injectable()
export class ReceiptsService {
    constructor(@InjectModel(Receipt) private readonly ReceiptRepository: typeof Receipt){

    }
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
        });
        return receipts;
    }
    async getReceiptById(id: number, userId: number): Promise<Receipt> {
      const receipt = await this.ReceiptRepository.findOne({
        where: { id: id, userId: userId }
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
      
      return receipt;
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



    }
