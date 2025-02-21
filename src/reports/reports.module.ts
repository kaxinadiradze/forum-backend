import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportsRepository } from './reports.repository';
import { UsersRepository } from 'src/users/users.repository';
import { PostsRepository } from 'src/posts/posts.repository';
import { AdminRepository } from 'src/admin/admin.repository';
@Module({
  controllers: [ReportsController],
  providers: [
    ReportsService,
    ReportsRepository,
    UsersRepository,
    PostsRepository,
    AdminRepository,
  ],
})
export class ReportsModule {}
