import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { CategoriesService } from './categories.service';
import { DeleteCategoryDto } from './dtos/deleteCategory.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get('')
  async seeCategories() {
    const categories = await this.categoriesService.seeCategories();
    return categories;
  }

  @Get(':name')
  async seeCategory(@Param('name') name: string) {
    const category = await this.categoriesService.seeCategory(name);
    return category;
  }

  @Post('')
  async createCategory(@Body() body: CreateCategoryDto) {
    const category = await this.categoriesService.createCategory(body.name);
    return category;
  }

  @Delete('')
  async deleteCategory(@Body() body: DeleteCategoryDto) {
    return await this.categoriesService.deleteCategory(body.id);
  }
}
