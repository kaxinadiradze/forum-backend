import { ModelClass } from 'objection';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryModel } from './models/category.model';

@Injectable()
export class CategoriesRepository {
  constructor(
    @Inject('CategoryModel') private categoryModel: ModelClass<CategoryModel>,
  ) {}

  async create(name: string) {
    const category = await this.categoryModel.query().insert({
      name,
    });
    if (!category) {
      return null;
    }
    return category;
  }

  async retrieveAll() {
    const categories = await this.categoryModel.query();
    return categories;
  }

  async deleteById(id: string) {
    return await this.categoryModel.query().deleteById(id);
  }

  async findById(id: string) {
    const category = await this.categoryModel.query().findById(id);
    if (!category) return null;
    return category;
  }

  async findByName(name: string) {
    const category = await this.categoryModel.query().findOne({ name });
    if (!category) {
      return null;
    }
    return category;
  }
}
