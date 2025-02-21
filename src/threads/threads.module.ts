import { Module } from '@nestjs/common';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from './threads.service';
import { ThreadsRepository } from './threads.repository';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoriesRepository } from 'src/categories/categories.repository';
import { AdminRepository } from 'src/admin/admin.repository';
import { PostsRepository } from 'src/posts/posts.repository';

@Module({
  controllers: [ThreadsController],
  providers: [
    ThreadsService,
    ThreadsRepository,
    UsersService,
    CategoriesService,
    CategoriesRepository,
    UsersRepository,
    AdminRepository,
    PostsRepository,
  ],
})
export class ThreadsModule {}
