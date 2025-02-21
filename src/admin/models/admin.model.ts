import { BaseModel } from 'src/database/basemodel';
import { UserModel } from 'src/users/models/user.model';
export class AdminModel extends BaseModel {
  static readonly tableName: string = 'administrators';

  id: string;
  userId: string;
  username: string;
  createdAt: Date;

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'administrators.user_id',
          to: 'users.id',
        },
      },
    };
  }
}
