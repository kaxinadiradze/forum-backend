import { BaseModel } from 'src/database/basemodel';
import { UserRoleModel } from 'src/user-roles/models/models/userRole.model';

export class RoleModel extends BaseModel {
  static readonly tableName = 'roles';

  id: string;
  name: string;

  static relationMappings() {
    return {
      userRoles: {
        relation: BaseModel.HasManyRelation,
        modelClass: UserRoleModel,
        join: { from: 'roles.id', to: 'user_roles.roleId' },
      },
    };
  }
}
