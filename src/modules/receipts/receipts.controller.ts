import { Controller, Post, Body, UseGuards, Request, Get, Patch, Param, Delete } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from "@nestjs/swagger";
import { ReceiptsService } from "./receipts.service";
import { CreateReceiptDTO, UpdateReceiptDTO, CreateReceiptFromImageDTO } from "./dto";
import { JwtAuthGuard } from "src/guards/jwt-guard";
import { Receipt } from "./models/receipt.model";

@ApiTags("Receipts")
@Controller("receipts")
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: "Create a new receipt" })
  @ApiBody({ type: CreateReceiptDTO })
  @ApiResponse({ status: 201, description: "Receipt created successfully", type: Receipt })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createReceipt(@Body() createReceiptDto: CreateReceiptDTO, @Request() req): Promise<Receipt> {
    const userId = req.user?.userId;
    return this.receiptsService.createReceipt(createReceiptDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post("parse-from-image")
  @ApiOperation({ summary: "Create a receipt from an image" })
  @ApiBody({ type: CreateReceiptFromImageDTO })
  @ApiResponse({ status: 201, description: "Receipt created from image successfully", type: Receipt })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createReceiptFromImage(
    @Body() createReceiptFromImageDto: CreateReceiptFromImageDTO,
    @Request() req,
  ): Promise<Receipt> {
    const userId = req.user?.userId;
    return this.receiptsService.createReceiptFromImage(createReceiptFromImageDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({ summary: "Get all receipts for the authenticated user" })
  @ApiResponse({ status: 200, description: "List of receipts", type: [Receipt] })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getAllReceipts(@Request() req) {
    const userId = req.user?.userId;
    return this.receiptsService.getAllReceipts(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get(":id")
  @ApiOperation({ summary: "Get a receipt by ID" })
  @ApiParam({ name: "id", description: "Receipt ID", example: 1 })
  @ApiResponse({ status: 200, description: "Receipt found", type: Receipt })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Receipt not found" })
  async getReceipt(@Param("id") id: number, @Request() req) {
    const userId = req.user?.userId;
    return this.receiptsService.getReceiptById(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(":id")
  @ApiOperation({ summary: "Update a receipt by ID" })
  @ApiParam({ name: "id", description: "Receipt ID", example: 1 })
  @ApiBody({ type: UpdateReceiptDTO })
  @ApiResponse({ status: 200, description: "Receipt updated successfully", type: Receipt })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Receipt not found" })
  async updateReceipt(@Param("id") id: number, @Body() updateReceiptDto: UpdateReceiptDTO, @Request() req) {
    const userId = req.user?.userId;
    return this.receiptsService.updateReceipt(id, updateReceiptDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(":id")
  @ApiOperation({ summary: "Delete a receipt by ID" })
  @ApiParam({ name: "id", description: "Receipt ID", example: 1 })
  @ApiResponse({ status: 200, description: "Receipt deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Receipt not found" })
  async deleteReceipt(@Param("id") id: number, @Request() req) {
    const userId = req.user?.userId;
    return this.receiptsService.deleteReceipt(id, userId);
  }
}