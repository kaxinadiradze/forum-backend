import {
  Controller,
  Post,
  UseInterceptors,
  BadRequestException,
  Req,
  Body,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from 'src/users/users.service';
import { Request } from 'src/users/users.controller';
import { EditProfileService } from './edit-profile.service';
import { UpdateBioDto } from './dtos/updateBio.dto';
import { UpdateBioRo } from './dtos/updateBio.Ro';
import { AuthGuard } from 'src/guards/auth.guard';
import { BanGuard } from 'src/guards/ban.guard';

@UseGuards(AuthGuard)
@UseGuards(BanGuard)
@Controller('edit-profile')
export class EditProfileController {
  constructor(
    private usersService: UsersService,
    private editProfileService: EditProfileService,
  ) {}

  @Post('update-bio')
  async updateBio(
    @Req() req: Request,
    @Body() body: UpdateBioDto,
  ): Promise<UpdateBioRo> {
    const userId = req.currentUser.id;
    const bio = body.bio;
    const updateBio = await this.editProfileService.updateBio(userId, bio);
    return updateBio;
  }

  @Post('profile-picture')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}`;
          const sanitizedFileName = file.originalname
            .replace(/[^a-zA-Z0-9.-]/g, '')
            .toLowerCase();
          callback(null, `${uniqueSuffix}-${sanitizedFileName}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const fileExt = extname(file.originalname).toLowerCase();

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Unsupported file type'),
            false,
          );
        }

        const dangerousExtensions = ['.php', '.exe', '.js', '.bat', '.sh'];
        if (dangerousExtensions.includes(fileExt)) {
          return callback(
            new BadRequestException('Dangerous file type detected'),
            false,
          );
        }

        callback(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB size limit
    }),
  )
  async updateAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!avatar) {
      throw new BadRequestException('No file provided');
    }
    const user = req.currentUser;
    const updatedUser = await this.editProfileService.updateProfilePicture(
      user.id,
      `/uploads/avatars/${avatar.filename}`,
    );

    return {
      message: 'Profile picture updated successfully',
      user: updatedUser,
    };
  }
}
