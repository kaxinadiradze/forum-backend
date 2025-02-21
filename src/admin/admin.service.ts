import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { UsersService } from 'src/users/users.service';
import { AdminModel } from './models/admin.model';
import { UserModel } from 'src/users/models/user.model';

@Injectable()
export class AdminService {
  constructor(
    private adminRepository: AdminRepository,
    private usersService: UsersService,
  ) {}

  async giveAdmin(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('user not found');
    const { username } = user;
    const checkIfAlreadyExist = await this.adminRepository.findByUserId(userId);
    if (checkIfAlreadyExist) {
      throw new BadRequestException('this user is already admin');
    }
    await this.adminRepository.create({ userId, username });
    return { message: `Assigned ${user.username} as admin` };
  }

  async seeAdmins() {
    const allAdmins = await AdminModel.query();
    return allAdmins;
  }

  async banUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    await UserModel.query().patchAndFetchById(userId, {
      isBanned: true,
    });
    return { message: `${user.username} was successfully banned` };
  }

  async unbanUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    await UserModel.query().patchAndFetchById(userId, {
      isBanned: false,
    });
    return { message: `${user.username} was successfully unbanned` };
  }

  async removeAdmin(userId: string) {
    const admin = await this.adminRepository.findByUserId(userId);
    if (!admin) {
      throw new NotFoundException('user not found');
    }

    await this.adminRepository.deleteById(admin.id);
    return { message: 'Admin privileges revoked successfully.' };
  }
}
