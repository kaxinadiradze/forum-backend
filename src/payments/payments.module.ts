import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { StripeService } from 'src/stripe/stripe.service';
import { UsersRepository } from 'src/users/users.repository';
import { RolesRepository } from 'src/roles/roles.repository';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';
import { PostsRepository } from 'src/posts/posts.repository';
import { AdminRepository } from 'src/admin/admin.repository';

@Module({
  controllers: [PaymentsController],
  providers: [
    UsersService,
    PostsRepository,
    PaymentsService,
    StripeService,
    UsersRepository,
    RolesRepository,
    RolesService,
    AdminRepository,
  ],
})
export class PaymentsModule {}
