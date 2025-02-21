import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';
import { MailerService } from 'src/mailer/mailer.service';
import { PostsRepository } from 'src/posts/posts.repository';

@Module({
  controllers: [SettingsController],
  providers: [
    SettingsService,
    UsersService,
    UsersRepository,
    MailerService,
    PostsRepository,
  ],
})
export class SettingsModule {}
