import { BaseModel } from 'src/database/basemodel';
import { PostModel } from 'src/posts/models/post.model';
import { UserModel } from 'src/users/models/user.model';

export class ReportModel extends BaseModel {
  static readonly tableName = 'reports';

  id!: string;
  reporterId!: string;
  reportedUserId!: string;
  reportedPostId!: string;
  reason!: string;
  status!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static relationMappings() {
    return {
      reportedPost: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: PostModel,
        join: { from: 'reports.reportedPostId', to: 'posts.id' },
      },

      reporter: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'reports.reporterId',
          to: 'users.id',
        },
      },

      reportedUser: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'reports.reportedUserId',
          to: 'users.id',
        },
      },
    };
  }
}
