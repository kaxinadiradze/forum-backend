import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { AdminModel } from './models/admin.model';

@Injectable()
export class AdminRepository {
  constructor(
    @Inject('AdminModel') private adminModel: ModelClass<AdminModel>,
  ) {}

  async create(adminData: AdminData) {
    const admin = await this.adminModel.query().insert(adminData);
    if (!admin) {
      return null;
    }
    return admin;
  }

  async findByUserId(userId: string) {
    const admin = await this.adminModel.query().findOne({ user_id: userId });
    if (!admin) {
      return null;
    }
    return admin;
  }

  async deleteById(id: string) {
    await this.adminModel.query().deleteById(id);
  }
}

export type AdminData = {
  userId: string;
  username: string;
};
