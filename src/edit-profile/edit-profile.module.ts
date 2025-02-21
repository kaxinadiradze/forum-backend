import { Module } from '@nestjs/common';
import { EditProfileController } from './edit-profile.controller';
import { EditProfileService } from './edit-profile.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [EditProfileController],
  providers: [EditProfileService],
})
export class EditProfileModule {}
