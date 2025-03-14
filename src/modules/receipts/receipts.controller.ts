import { Controller, Post, Body, UseGuards, Request,Get, Patch, Param, Delete } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { CreateReceiptDTO,UpdateReceiptDTO } from './dto';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { Receipt } from './models/receipt.model';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReceipt(@Body() createReceiptDto: CreateReceiptDTO,@Request() req,): Promise<Receipt> {
    
    const userId = req.user?.userId;
    return this.receiptsService.createReceipt(createReceiptDto, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllReceipts(@Request() req){
    const userId = req.user?.userId;
    return this.receiptsService.getAllReceipts(userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getReceipt(@Param('id') id: number, @Request() req) {
    const userId = req.user?.userId;
    return this.receiptsService.getReceiptById(id, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateReceipt(@Param('id') id: number, @Body() updateReceiptDto: UpdateReceiptDTO, @Request() req) {
    const userId = req.user?.userId;
    return this.receiptsService.updateReceipt(id, updateReceiptDto, userId);
  }
  @UseGuards(JwtAuthGuard)
@Delete(':id')
async deleteReceipt(@Param('id') id: number, @Request() req) {
  const userId = req.user?.userId;
  return this.receiptsService.deleteReceipt(id, userId);
}



}