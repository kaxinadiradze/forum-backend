import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { RoleModel } from './models/role.model';

@Injectable()
export class RolesRepository {
  constructor(@Inject('RoleModel') private roleModel: ModelClass<RoleModel>) {}

  async create(name: string) {
    const role = await this.roleModel.query().insert({ name });
    return role;
  }

  async findByName(name: string) {
    const role = await this.roleModel.query().where('name', name).first();
    if (!role) return null;
    return role;
  }

  async findById(id: string) {
    const role = await this.roleModel.query().findById(id);
    if (!role) return null;
    return role;
  }

  async deleteById(id: string) {
    await this.roleModel.query().deleteById(id);
  }
}

export enum Roles {
  member = 'Member',
  moderator = 'Moderator',
  vip = 'VIP',
}
