import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Delete,
  Patch,
  Put,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDTO, UpdateCategoryDTO } from "./dto";
import { JwtAuthGuard } from "src/guards/jwt-guard";
import { Category } from "./models/category.model";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: "Create a new category" })
  @ApiBody({ type: CreateCategoryDTO })
  @ApiResponse({ status: 201, description: "Category created successfully", type: Category })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createCategory(@Body() createCategoryDto: CreateCategoryDTO, @Request() req): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({ status: 200, description: "List of all categories", type: [Category] })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get(":id")
  @ApiOperation({ summary: "Get a category by ID" })
  @ApiParam({ name: "id", description: "Category ID", example: 1 })
  @ApiResponse({ status: 200, description: "Category found", type: Category })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Category not found" })
  async getCategory(@Param("id") id: number) {
    return this.categoriesService.getCategoryById(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get(":id/expense-items")
  @ApiOperation({ summary: "Get expense items by category ID" })
  @ApiParam({ name: "id", description: "Category ID", example: 1 })
  @ApiResponse({ status: 200, description: "List of expense items", type: Array })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Category not found" })
  async getExpenseItemsByCategory(@Param("id") id: number, @Request() req) {
    const userId = req.user?.userId;
    return this.categoriesService.getExpenseItemsByCategory(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(":id")
  @ApiOperation({ summary: "Delete a category by ID" })
  @ApiParam({ name: "id", description: "Category ID", example: 1 })
  @ApiResponse({ status: 200, description: "Category deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Category not found" })
  async deleteCategory(@Param("id") id: number) {
    return this.categoriesService.deleteCategory(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(":id")
  @ApiOperation({ summary: "Partially update a category by ID" })
  @ApiParam({ name: "id", description: "Category ID", example: 1 })
  @ApiBody({ type: UpdateCategoryDTO })
  @ApiResponse({ status: 200, description: "Category partially updated successfully", type: Category })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Category not found" })
  async updateCategoryPartial(@Param("id") id: number, @Body() updateCategoryDto: UpdateCategoryDTO) {
    return this.categoriesService.updateCategory(id, updateCategoryDto, false);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Put(":id")
  @ApiOperation({ summary: "Fully update a category by ID" })
  @ApiParam({ name: "id", description: "Category ID", example: 1 })
  @ApiBody({ type: UpdateCategoryDTO })
  @ApiResponse({ status: 200, description: "Category fully updated successfully", type: Category })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Category not found" })
  async updateCategoryFull(@Param("id") id: number, @Body() updateCategoryDto: UpdateCategoryDTO) {
    return this.categoriesService.updateCategory(id, updateCategoryDto, true);
  }
}