import { Controller, Post, Body, UseGuards, Request, Get, Param, Delete, Patch, Put } from '@nestjs/common';
import { ExpenseItemsService } from './expense-items.service';
import { CreateExpenseItemDTO, UpdateExpenseItemDTO } from './dto';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { ExpenseItem } from './models/expense-item.model';

@Controller('expense-items')
export class ExpenseItemsController {
  constructor(private readonly expenseItemsService: ExpenseItemsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createExpenseItem(@Body() createExpenseItemDto: CreateExpenseItemDTO, @Request() req): Promise<ExpenseItem> {
    const userId = req.user?.userId;
    return this.expenseItemsService.createExpenseItem(createExpenseItemDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('receipt/:receiptId')
  async getExpenseItemsByReceiptId(@Param('receiptId') receiptId: number, @Request() req) {
    const userId = req.user?.userId;
    return this.expenseItemsService.getExpenseItemsByReceiptId(receiptId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getExpenseItem(@Param('id') id: number, @Request() req) {
    const userId = req.user?.userId;
    return this.expenseItemsService.getExpenseItemById(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteExpenseItem(@Param('id') id: number, @Request() req) {
    const userId = req.user?.userId;
    return this.expenseItemsService.deleteExpenseItem(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateExpenseItemPartial(@Param('id') id: number, @Body() updateExpenseItemDto: UpdateExpenseItemDTO, @Request() req) {
    const userId = req.user?.userId;
    return this.expenseItemsService.updateExpenseItem(id, updateExpenseItemDto, userId, false);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateExpenseItemFull(@Param('id') id: number, @Body() updateExpenseItemDto: UpdateExpenseItemDTO, @Request() req
  ) {
    const userId = req.user?.userId;
    return this.expenseItemsService.updateExpenseItem(id, updateExpenseItemDto, userId, true);
  }
}