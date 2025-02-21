import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { UsersService } from 'src/users/users.service';
import { UserRoleModel } from 'src/user-roles/models/models/userRole.model';
import { StripeService } from 'src/stripe/stripe.service';
import { UsersRepository } from 'src/users/users.repository';

export enum Statuses {
  pending = 'Pending',
  paid = 'Paid',
}

@Injectable()
export class RolesService {
  constructor(
    private rolesRepository: RolesRepository,
    private usersService: UsersService,
    private stripeService: StripeService,
    private usersRepository: UsersRepository,
  ) {}

  async create(name: string) {
    const checkIfExist = await this.rolesRepository.findByName(name);
    if (checkIfExist)
      throw new BadRequestException('Role with this name already exists');
    const createRole = await this.rolesRepository.create(name);
    return createRole;
  }

  async deleteById(id: string) {
    const role = await this.rolesRepository.findById(id);
    if (!role) throw new NotFoundException('Role not found');
    await this.rolesRepository.deleteById(id);
    return { message: `${role.name} was deleted successfully` };
  }

  async revokeRole(userId: string, roleId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const role = await this.rolesRepository.findById(roleId);
    if (!role) throw new NotFoundException('Role not found');
    const userRoleRecord = await UserRoleModel.query()
      .where('user_id', userId)
      .andWhere('role_id', roleId)
      .first();
    if (!userRoleRecord)
      throw new NotFoundException('This user does not has this role');
    await UserRoleModel.query().deleteById(userRoleRecord.id);
    return { message: 'Role revoked successfully' };
  }
}
