import { BaseModel } from 'src/database/basemodel';
import { UserModel } from 'src/users/models/user.model';

export class ResetTokenModel extends BaseModel {
  static readonly tableName = 'reset_tokens';

  id!: string;
  email!: string;
  userId!: string;
  resetToken!: string;
  resetTokenExpiresAt!: Date;

  static get relationMappings() {
    return {
      userEmail: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'reset_tokens.email',
          to: 'users.email',
        },
      },
      userid: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'reset_tokens.userId',
          to: 'users.id',
        },
      },
    };
  }
}
