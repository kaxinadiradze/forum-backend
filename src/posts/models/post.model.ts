import { BaseModel } from 'src/database/basemodel';
import { ReportModel } from 'src/reports/models/report.model';
import { ThreadModel } from 'src/threads/models/thread.model';
import { UserModel } from 'src/users/models/user.model';

export class PostModel extends BaseModel {
  static readonly tableName = 'posts';

  id: string;
  content: string;
  threadId: string;
  userId: string;
  parentPostId: string;
  isLocked: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;

  static relationMappings() {
    return {
      reportedPost: {
        relation: BaseModel.HasManyRelation,
        modelClass: ReportModel,
        join: {
          from: 'posts.id',
          to: 'reports.reportedPostId',
        },
      },

      thread: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: ThreadModel,
        join: {
          from: 'posts.threadId',
          to: 'threads.id',
        },
      },

      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'posts.userId',
          to: 'users.id',
        },
      },

      parentPost: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: PostModel,
        join: {
          from: 'posts.parentPostId',
          to: 'posts.id',
        },
      },

      likes: {
        relation: BaseModel.HasManyRelation,
        modelClass: PostModel,
        join: {
          from: 'posts.id',
          to: 'likes.postId',
        },
      },
    };
  }
}
