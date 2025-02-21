import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { AdminRepository } from 'src/admin/admin.repository';
import { PostsRepository } from 'src/posts/posts.repository';
import { ReportsService } from 'src/reports/reports.service';
import { ReportsRepository } from 'src/reports/reports.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    AdminRepository,
    PostsRepository,
    ReportsService,
    ReportsRepository,
  ],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
