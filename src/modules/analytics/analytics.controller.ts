import { Controller, Get, Query, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from 'src/guards/jwt-guard';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('expenses-per-category')
  @ApiOperation({ summary: 'Get expenses grouped by category for the user' })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date of the period (ISO format, e.g., 2025-01-01)',
    example: '2025-01-01',
    required: true,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date of the period (ISO format, e.g., 2025-03-31)',
    example: '2025-03-31',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Expenses per category retrieved successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Invalid date format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getExpensesPerCategory(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
  ) {
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
      throw new BadRequestException('Invalid date format. Use ISO format (e.g., 2025-01-01).');
    }
    const userId = req.user?.userId;
    return this.analyticsService.getExpensesPerCategory(startDate, endDate, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('total-expenses')
  @ApiOperation({ summary: 'Get total expenses for a period for the user' })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date of the period (ISO format, e.g., 2025-01-01)',
    example: '2025-01-01',
    required: true,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date of the period (ISO format, e.g., 2025-03-31)',
    example: '2025-03-31',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Total expenses retrieved successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Invalid date format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTotalExpenses(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
  ) {
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
      throw new BadRequestException('Invalid date format. Use ISO format (e.g., 2025-01-01).');
    }
    const userId = req.user?.userId;
    return this.analyticsService.getTotalExpenses(startDate, endDate, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('family-expenses-per-category')
  @ApiOperation({ summary: 'Get family expenses grouped by category' })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date of the period (ISO format, e.g., 2025-01-01)',
    example: '2025-01-01',
    required: true,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date of the period (ISO format, e.g., 2025-03-31)',
    example: '2025-03-31',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Family expenses per category retrieved successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Invalid date format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Family not found' })
  async getFamilyExpensesPerCategory(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
  ) {
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
      throw new BadRequestException('Invalid date format. Use ISO format (e.g., 2025-01-01).');
    }
    const userId = req.user?.userId;
    return this.analyticsService.getFamilyExpensesPerCategory(startDate, endDate, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('family-total-expenses')
  @ApiOperation({ summary: 'Get total family expenses for a period' })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date of the period (ISO format, e.g., 2025-01-01)',
    example: '2025-01-01',
    required: true,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date of the period (ISO format, e.g., 2025-03-31)',
    example: '2025-03-31',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Total family expenses retrieved successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Invalid date format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Family not found' })
  async getFamilyTotalExpenses(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
  ) {
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
      throw new BadRequestException('Invalid date format. Use ISO format (e.g., 2025-01-01).');
    }
    const userId = req.user?.userId;
    return this.analyticsService.getFamilyTotalExpenses(startDate, endDate, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('family-member-expenses')
  @ApiOperation({ summary: 'Get expenses of each family member for a period' })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date of the period (ISO format, e.g., 2025-01-01)',
    example: '2025-01-01',
    required: true,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date of the period (ISO format, e.g., 2025-03-31)',
    example: '2025-03-31',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Expenses of each family member retrieved successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Invalid date format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Family not found' })
  async getFamilyMemberExpenses(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
  ) {
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
      throw new BadRequestException('Invalid date format. Use ISO format (e.g., 2025-01-01).');
    }
    const userId = req.user?.userId;
    return this.analyticsService.getFamilyMemberExpenses(startDate, endDate, userId);
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
}