import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from 'src/guards/jwt-guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('expenses-per-category')
  async getExpensesPerCategory(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
  ) {
    const userId = req.user?.userId;
    return this.analyticsService.getExpensesPerCategory(startDate, endDate, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('total-expenses')
  async getTotalExpenses(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
  ) {
    const userId = req.user?.userId;
    return this.analyticsService.getTotalExpenses(startDate, endDate, userId);
  }
}