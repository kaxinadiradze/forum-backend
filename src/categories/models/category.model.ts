import { BaseModel } from 'src/database/basemodel';
import { ThreadModel } from 'src/threads/models/thread.model';

export class CategoryModel extends BaseModel {
  static readonly tableName = 'categories';
  id!: string;
  name!: string;
  description!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static relationMappings() {
    return {
      threads: {
        relation: BaseModel.HasManyRelation,
        modelClass: ThreadModel,
        join: {
          from: 'categories.id',
          to: 'threads.category_id',
        },
      },
    };
  }
}
