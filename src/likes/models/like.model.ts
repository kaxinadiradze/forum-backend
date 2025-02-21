import { BaseModel } from 'src/database/basemodel';
import { PostModel } from 'src/posts/models/post.model';
import { UserModel } from 'src/users/models/user.model';

export class LikeModel extends BaseModel {
  static readonly tableName = 'likes';

  id: string;
  userId: string;
  postId: string;
  createdAt: Date;

  static relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'likes.userId',
          to: 'users.id',
        },
      },

      post: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: PostModel,
        join: {
          from: 'likes.postId',
          to: 'posts.id',
        },
      },
    };
  }
}
