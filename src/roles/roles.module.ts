import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RolesRepository } from './roles.repository';
import { AdminRepository } from 'src/admin/admin.repository';
import { StripeService } from 'src/stripe/stripe.service';
import { UsersRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { PostsRepository } from 'src/posts/posts.repository';

@Module({
  controllers: [RolesController],
  providers: [
    RolesService,
    RolesRepository,
    AdminRepository,
    StripeService,
    UsersRepository,
    UsersService,
    PostsRepository,
  ],
})
export class RolesModule {}
