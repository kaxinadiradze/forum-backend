import {
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Query,
  Body,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesService } from 'src/roles/roles.service';
import { StripeService } from 'src/stripe/stripe.service';
import { PaymentsService } from './payments.service';
import { GiftVipDto } from './dtos/giftVip.dto';
import { Request } from 'src/users/users.controller';
import { AdminGuard } from 'src/guards/admin.guard';
@UseGuards(AuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(
    private stripeService: StripeService,
    private rolesService: RolesService,
    private paymentService: PaymentsService,
  ) {}

  @Get('/paymentSuccess')
  async paymentSuccess(@Query('session_id') sessionId: string) {
    const session = await this.paymentService.payment(sessionId);
    return session;
  }

  @Post('/get-vip')
  async getVipRole(@Req() req: Request) {
    const userId = req.currentUser.id;
    const session = await this.stripeService.createCheckoutSession(userId);
    return session;
  }

  @Post('/gift-vip')
  async giftVip(@Body() body: GiftVipDto, @Req() req: Request) {
    const gifterId = req.currentUser.id;
    const session = await this.paymentService.giftVip(
      gifterId,
      body.recipientId,
    );
    return session;
  }

  @UseGuards(AdminGuard)
  @Post('delete')
  async deletePaymentRecord(@Body('id') id: string) {
    return await this.paymentService.delete(id);
  }
}
