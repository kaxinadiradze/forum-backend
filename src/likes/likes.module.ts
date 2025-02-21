import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { LikesRepository } from './likes.repository';
import { PostsService } from 'src/posts/posts.service';
import { PostsRepository } from 'src/posts/posts.repository';
import { ThreadsRepository } from 'src/threads/threads.repository';
import { AdminRepository } from 'src/admin/admin.repository';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';

@Module({
  controllers: [LikesController],
  providers: [
    LikesService,
    LikesRepository,
    PostsService,
    PostsRepository,
    ThreadsRepository,
    AdminRepository,
    UsersService,
    UsersRepository,
  ],
})
export class LikesModule {}
