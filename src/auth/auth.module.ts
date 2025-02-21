import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersRepository } from 'src/users/users.repository';
import { MailerService } from 'src/mailer/mailer.service';
import { SettingsService } from 'src/settings/settings.service';
import { UsersService } from 'src/users/users.service';
import { PostsRepository } from 'src/posts/posts.repository';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    UsersRepository,
    MailerService,
    SettingsService,
    PostsRepository,
  ],
})
export class AuthModule {}
