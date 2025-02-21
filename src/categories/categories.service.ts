import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async createCategory(name: string) {
    const category = await this.categoriesRepository.findByName(name);
    if (category) {
      throw new BadRequestException('category with this name already exist');
    }
    return await this.categoriesRepository.create(name);
  }

  async seeCategories() {
    const allCategory = await this.categoriesRepository.retrieveAll();
    return allCategory;
  }

  async deleteCategory(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException('category not found');
    }
    return await this.categoriesRepository.deleteById(id);
  }

  async seeCategory(name: string) {
    const category = await this.categoriesRepository.findByName(name);
    if (!category) throw new NotFoundException('category does not exist');
    return category;
  }

  async findById(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new NotFoundException('category does not exist');
    return category;
  }
}
