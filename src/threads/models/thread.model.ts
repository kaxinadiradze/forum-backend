import { BaseModel } from 'src/database/basemodel';
import { UserModel } from 'src/users/models/user.model';
import { CategoryModel } from 'src/categories/models/category.model';
import { PostModel } from 'src/posts/models/post.model';

export class ThreadModel extends BaseModel {
  static readonly tableName = 'threads';

  id: string;
  title: string;
  content: string;
  categoryId: string;
  userId: string;
  views: number;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;

  static relationMappings() {
    return {
      category: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: CategoryModel,
        join: {
          from: 'threads.category_id',
          to: 'categories.id',
        },
      },

      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'threads.user_id',
          to: 'users.id',
        },
      },

      posts: {
        relation: BaseModel.HasManyRelation,
        modelClass: PostModel,
        join: {
          from: 'threads.id',
          to: 'posts.threadId',
        },
      },
    };
  }
}
