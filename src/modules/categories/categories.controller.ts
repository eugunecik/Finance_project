import { Controller, Post, Body, UseGuards, Request, Get, Param, Delete, Patch, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dto';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { Category } from './models/category.model';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDTO, @Request() req): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCategory(@Param('id') id: number) {
    return this.categoriesService.getCategoryById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/expense-items')
  async getExpenseItemsByCategory(@Param('id') id: number, @Request() req) {
    const userId = req.user?.userId;
    return this.categoriesService.getExpenseItemsByCategory(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: number) {
    return this.categoriesService.deleteCategory(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateCategoryPartial(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDTO) {
    return this.categoriesService.updateCategory(id, updateCategoryDto, false);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCategoryFull(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDTO) {
    return this.categoriesService.updateCategory(id, updateCategoryDto, true);
  }
}