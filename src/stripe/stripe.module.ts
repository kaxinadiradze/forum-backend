import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { RolesRepository } from 'src/roles/roles.repository';

@Module({
  providers: [StripeService, RolesRepository],
  exports: [StripeService],
})
export class StripeModule {}
