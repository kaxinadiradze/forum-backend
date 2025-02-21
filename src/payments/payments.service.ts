import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { StripeService } from 'src/stripe/stripe.service';
import { UsersRepository } from 'src/users/users.repository';
import { PaymentModel } from './models/payment.model';
import { Statuses } from 'src/roles/roles.service';
import { UserRoleModel } from 'src/user-roles/models/models/userRole.model';
import { RolesRepository, Roles } from 'src/roles/roles.repository';

@Injectable()
export class PaymentsService {
  constructor(
    private stripeService: StripeService,
    private usersRepository: UsersRepository,
    private rolesRepository: RolesRepository,
  ) {}
  async payment(sessionId: string) {
    const session = await this.stripeService.verifyPayment(sessionId);
    if (session.payment_status === 'paid') {
      const trx = await PaymentModel.startTransaction();
      const paymentRecord = await PaymentModel.query()
        .where('stripe_session_id', sessionId)
        .first();
      if (!paymentRecord) throw new NotFoundException('Invalid sessionId');
      if (paymentRecord.status === Statuses.paid) {
        throw new BadRequestException(
          'This payment has already been processed.',
        );
      }
      try {
        await PaymentModel.query(trx).patchAndFetchById(paymentRecord.id, {
          status: Statuses.paid,
        });

        const targetUserId = paymentRecord.recipientId || paymentRecord.userId;
        await this.usersRepository.assignRoleToUser(
          targetUserId,
          Roles.vip,
          trx,
        );

        // Update payment record
        await trx.commit();

        return { message: 'Vip role assigned and payment recorded' };
      } catch (error) {
        await trx.rollback();
        throw new BadRequestException('Transaction failed: ' + error.message);
      }
    }

    throw new BadRequestException('Payment not completed');
  }

  async giftVip(gifterId: string, recipientId: string) {
    if (gifterId == recipientId)
      throw new BadRequestException('You can not gift vip to yourself');
    const recipient = await this.usersRepository.findById(recipientId);
    if (!recipient) throw new NotFoundException('Recipient not found');
    const vipRole = await this.rolesRepository.findByName(Roles.vip);
    const checkVip = await UserRoleModel.query()
      .where('userId', recipientId)
      .andWhere('roleId', vipRole.id)
      .first();
    if (checkVip) throw new BadRequestException('Recipient already has vip');
    const session = await this.stripeService.createGiftVipCheckoutSession(
      gifterId,
      recipientId,
    );

    return { session };
  }

  async delete(id: string) {
    const paymentRecord = await PaymentModel.query().findById(id);
    if (!paymentRecord) throw new NotFoundException('Record not found');
    await PaymentModel.query().deleteById(id);
    return { message: 'payment record deleted successfully' };
  }
}
