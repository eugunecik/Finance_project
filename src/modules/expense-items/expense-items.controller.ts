import { Controller, Post, Body, UseGuards, Request, Get, Param, Delete, Patch, Put } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from "@nestjs/swagger";
import { ExpenseItemsService } from "./expense-items.service";
import { CreateExpenseItemDTO, UpdateExpenseItemDTO } from "./dto";
import { JwtAuthGuard } from "src/guards/jwt-guard";
import { ExpenseItem } from "./models/expense-item.model";

@ApiTags("Expense Items")
@Controller("expense-items")
export class ExpenseItemsController {
  constructor(private readonly expenseItemsService: ExpenseItemsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: "Create a new expense item" })
  @ApiBody({ type: CreateExpenseItemDTO })
  @ApiResponse({ status: 201, description: "Expense item created successfully", type: ExpenseItem })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createExpenseItem(@Body() createExpenseItemDto: CreateExpenseItemDTO, @Request() req): Promise<ExpenseItem> {
    const userId = req.user?.userId;
    return this.expenseItemsService.createExpenseItem(createExpenseItemDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get("receipt/:receiptId")
  @ApiOperation({ summary: "Get all expense items by receipt ID" })
  @ApiParam({ name: "receiptId", description: "Receipt ID", example: 1 })
  @ApiResponse({ status: 200, description: "List of expense items", type: [ExpenseItem] })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Receipt not found" })
  async getExpenseItemsByReceiptId(@Param("receiptId") receiptId: number, @Request() req) {
    const userId = req.user?.userId;
    return this.expenseItemsService.getExpenseItemsByReceiptId(receiptId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get(":id")
  @ApiOperation({ summary: "Get an expense item by ID" })
  @ApiParam({ name: "id", description: "Expense item ID", example: 1 })
  @ApiResponse({ status: 200, description: "Expense item found", type: ExpenseItem })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Expense item not found" })
  async getExpenseItem(@Param("id") id: number, @Request() req) {
    const userId = req.user?.userId;
    return this.expenseItemsService.getExpenseItemById(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(":id")
  @ApiOperation({ summary: "Delete an expense item by ID" })
  @ApiParam({ name: "id", description: "Expense item ID", example: 1 })
  @ApiResponse({ status: 200, description: "Expense item deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Expense item not found" })
  async deleteExpenseItem(@Param("id") id: number, @Request() req) {
    const userId = req.user?.userId;
    return this.expenseItemsService.deleteExpenseItem(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(":id")
  @ApiOperation({ summary: "Partially update an expense item by ID" })
  @ApiParam({ name: "id", description: "Expense item ID", example: 1 })
  @ApiBody({ type: UpdateExpenseItemDTO })
  @ApiResponse({ status: 200, description: "Expense item partially updated successfully", type: ExpenseItem })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Expense item not found" })
  async updateExpenseItemPartial(
    @Param("id") id: number,
    @Body() updateExpenseItemDto: UpdateExpenseItemDTO,
    @Request() req,
  ) {
    const userId = req.user?.userId;
    return this.expenseItemsService.updateExpenseItem(id, updateExpenseItemDto, userId, false);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Put(":id")
  @ApiOperation({ summary: "Fully update an expense item by ID" })
  @ApiParam({ name: "id", description: "Expense item ID", example: 1 })
  @ApiBody({ type: UpdateExpenseItemDTO })
  @ApiResponse({ status: 200, description: "Expense item fully updated successfully", type: ExpenseItem })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Expense item not found" })
  async updateExpenseItemFull(
    @Param("id") id: number,
    @Body() updateExpenseItemDto: UpdateExpenseItemDTO,
    @Request() req,
  ) {
    const userId = req.user?.userId;
    return this.expenseItemsService.updateExpenseItem(id, updateExpenseItemDto, userId, true);
  }
}