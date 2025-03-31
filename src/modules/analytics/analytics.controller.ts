import { Controller, Get, Query, UseGuards, Request } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { AnalyticsService } from "./analytics.service";
import { JwtAuthGuard } from "src/guards/jwt-guard";

@ApiTags("Analytics")
@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get("expenses-per-category")
  @ApiOperation({ summary: "Get expenses grouped by category" })
  @ApiQuery({
    name: "startDate",
    description: "Start date of the period (ISO format)",
    example: "2025-01-01",
    required: true,
  })
  @ApiQuery({
    name: "endDate",
    description: "End date of the period (ISO format)",
    example: "2025-03-31",
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: "Expenses per category retrieved successfully",
    type: Object,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getExpensesPerCategory(
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
    @Request() req,
  ) {
    const userId = req.user?.userId;
    return this.analyticsService.getExpensesPerCategory(startDate, endDate, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get("total-expenses")
  @ApiOperation({ summary: "Get total expenses for a period" })
  @ApiQuery({
    name: "startDate",
    description: "Start date of the period (ISO format)",
    example: "2025-01-01",
    required: true,
  })
  @ApiQuery({
    name: "endDate",
    description: "End date of the period (ISO format)",
    example: "2025-03-31",
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: "Total expenses retrieved successfully",
    type: Number,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getTotalExpenses(
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
    @Request() req,
  ) {
    const userId = req.user?.userId;
    return this.analyticsService.getTotalExpenses(startDate, endDate, userId);
  }
}