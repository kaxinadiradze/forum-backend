import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { ThreadsRepository } from 'src/threads/threads.repository';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';
import { AdminRepository } from 'src/admin/admin.repository';
import { ReportsService } from 'src/reports/reports.service';
import { ReportsRepository } from 'src/reports/reports.repository';

@Module({
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    ThreadsRepository,
    UsersService,
    UsersRepository,
    AdminRepository,
    ReportsService,
    ReportsRepository,
  ],
})
export class PostsModule {}
