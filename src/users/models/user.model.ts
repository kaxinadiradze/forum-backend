import { AdminModel } from 'src/admin/models/admin.model';
import { BaseModel } from 'src/database/basemodel';
import { LikeModel } from 'src/likes/models/like.model';
import { PostModel } from 'src/posts/models/post.model';
import { ReportModel } from 'src/reports/models/report.model';
import { ResetTokenModel } from 'src/resetTokens/resetToken.model';
import { ThreadModel } from 'src/threads/models/thread.model';
export class UserModel extends BaseModel {
  static readonly tableName = 'users';

  id!: string;
  username!: string;
  email!: string;
  password!: string;
  bio: string;
  twoStepEnabled: boolean;
  isBanned: boolean;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;

  static get relationMappings() {
    return {
      reportedUser: {
        relation: BaseModel.HasManyRelation,
        modelClass: ReportModel,
        join: { from: 'users.id', to: 'reports.reportedUserId' },
      },

      reporter: {
        relation: BaseModel.HasManyRelation,
        modelClass: ReportModel,
        join: {
          from: 'users.id',
          to: 'reports.reporterId',
        },
      },

      userRole: {
        relation: BaseModel.HasManyRelation,
        modelClass: ReportModel,
        join: {
          from: 'users.id',
          to: 'user_roles.userId',
        },
      },

      resetTokensByEmail: {
        relation: BaseModel.HasManyRelation,
        modelClass: ResetTokenModel,
        join: {
          from: 'users.email',
          to: 'reset_tokens.email',
        },
      },

      resetTokensById: {
        relation: BaseModel.HasManyRelation,
        modelClass: ResetTokenModel,
        join: {
          from: 'users.id',
          to: 'reset_tokens.userId',
        },
      },

      admin: {
        relation: BaseModel.HasOneRelation,
        modelClass: AdminModel,
        join: {
          from: 'users.id',
          to: 'administrators.user_id',
        },
      },

      threads: {
        relation: BaseModel.HasManyRelation,
        modelClass: ThreadModel,
        join: {
          from: 'users.id',
          to: 'threads.user_id',
        },
      },

      posts: {
        relation: BaseModel.HasManyRelation,
        modelClass: PostModel,
        join: {
          from: 'users.id',
          to: 'posts.userId',
        },
      },

      likes: {
        relation: BaseModel.HasManyRelation,
        modelClass: LikeModel,
        join: {
          from: 'users.id',
          to: 'likes.userId',
        },
      },
    };
  }
}
