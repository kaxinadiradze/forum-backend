import { BaseModel } from 'src/database/basemodel';
import { RoleModel } from 'src/roles/models/role.model';
import { UserModel } from 'src/users/models/user.model';
export class UserRoleModel extends BaseModel {
  static readonly tableName = 'user_roles';

  id: string;
  userId: string;
  roleId: string;

  static relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'user_roles.userId',
          to: 'users.id',
        },
      },
      role: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: RoleModel,
        join: {
          from: 'user_roles.roleId',
          to: 'roles.id',
        },
      },
    };
  }
}
