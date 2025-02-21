import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';
import { PostsRepository } from 'src/posts/posts.repository';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    PostsRepository,
    AdminRepository,
    UsersService,
    UsersRepository,
  ],
})
export class AdminModule {}
