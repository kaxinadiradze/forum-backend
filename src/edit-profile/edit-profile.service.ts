import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserModel } from 'src/users/models/user.model';
@Injectable()
export class EditProfileService {
  constructor(private readonly usersService: UsersService) {}
  async updateBio(userId: string, bio: string) {
    await this.usersService.findById(userId);
    await UserModel.query().patchAndFetchById(userId, {
      bio,
    });
    const updatedUser = await this.usersService.findById(userId);
    return updatedUser;
  }

  async updateProfilePicture(userId: string, avatarUrl: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await UserModel.query().patchAndFetchById(userId, {
      avatarUrl: avatarUrl,
    });
    return updatedUser;
  }
}
