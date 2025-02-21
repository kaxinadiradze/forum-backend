import { UserModel } from './models/user.model';
import { ModelClass } from 'objection';
import { Inject, Injectable } from '@nestjs/common';
import { SignUpData } from 'src/auth/auth.service';
import { OtpModel } from 'src/otps/models/otp.model';
import { Knex } from 'knex';
import { RoleModel } from 'src/roles/models/role.model';
import { UserRoleModel } from 'src/user-roles/models/models/userRole.model';
@Injectable()
export class UsersRepository {
  constructor(
    @Inject('UserModel') private userModel: ModelClass<UserModel>,
    @Inject('OtpModel') private otpModel: ModelClass<OtpModel>,
    @Inject('KnexInstance') private knex: Knex,
    @Inject('RoleModel') private roleModel: ModelClass<RoleModel>,
    @Inject('UserRoleModel') private userRoleModel: ModelClass<UserRoleModel>,
  ) {}

  async create(signUpdata: SignUpData, trx?: Knex.Transaction) {
    const user = await this.userModel
      .query(trx || this.knex)
      .insert(signUpdata);
    if (!user) {
      return null;
    }
    return user;
  }

  async deleteById(userId: string) {
    const deleteUser = await this.userModel.query().deleteById(userId);
    if (!deleteUser) {
      return null;
    }
    return 'user successfully deleted';
  }

  async findByUsername(username: string) {
    const user = await this.userModel.query().findOne({ username });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.query().findOne({ email });
    if (!user) {
      return null;
    }
    return user;
  }

  async findById(id: string) {
    const user = await this.userModel.query().findById(id);
    if (!user) {
      return null;
    }
    return user;
  }

  async updateUser(userId: string, userData: Partial<UserModel>) {
    const update = await this.userModel
      .query()
      .patchAndFetchById(userId, userData);
    return update;
  }

  async findOtp(email: string, otp: string) {
    const otpRecord = await this.otpModel.query().findOne({ email, otp });
    if (!otpRecord) {
      return null;
    }
    return otpRecord;
  }

  async assignRoleToUser(userId: string, role: string, trx?: Knex.Transaction) {
    const memberRole = await this.roleModel
      .query(trx)
      .where('name', role)
      .first();
    console.log(memberRole);
    if (!memberRole) {
      throw new Error('Role does not exist');
    }

    await this.userRoleModel
      .query(trx)
      .insert({ userId, roleId: memberRole.id });
  }
}
