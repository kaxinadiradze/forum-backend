import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { UserRoleModel } from 'src/user-roles/models/models/userRole.model';
import { Roles, RolesRepository } from 'src/roles/roles.repository';
import { PaymentModel } from 'src/payments/models/payment.model';
import { Statuses } from 'src/roles/roles.service';
@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private rolesRepository: RolesRepository) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-01-27.acacia',
    });
  }

  async createCheckoutSession(userId: string) {
    const existingPendingPayment = await PaymentModel.query()
      .where('user_id', userId)
      .andWhere('status', Statuses.pending)
      .first();

    if (existingPendingPayment) {
      return {
        checkoutUrl: `https://checkout.stripe.com/pay/${existingPendingPayment.stripeSessionId}`,
      };
    }
    const vipRole = await this.rolesRepository.findByName(Roles.vip);
    const checkIfPurchased = await UserRoleModel.query()
      .where('user_id', userId)
      .andWhere('role_id', vipRole.id)
      .first();
    console.log('kaxi');
    if (checkIfPurchased)
      throw new BadRequestException('You already have VIP role');
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Vip Membership' },
            unit_amount: 1000, // $10.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/payments/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/payments/paymentCancel`,
      metadata: { userId },
    });
    console.log(session);
    await PaymentModel.query().insert({
      userId: userId,
      stripeSessionId: session.id,
      amount: 1000,
      currency: 'usd',
      status: Statuses.pending,
    });

    return { url: session.url };
  }

  async verifyPayment(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    return session;
  }

  async createGiftVipCheckoutSession(gifterId: string, recipientId: string) {
    const existingPendingPayment = await PaymentModel.query()
      .where('user_id', gifterId)
      .andWhere('status', Statuses.pending)
      .first();

    if (existingPendingPayment) {
      return {
        checkoutUrl: `https://checkout.stripe.com/pay/${existingPendingPayment.stripeSessionId}`,
      };
    }
    // Here you can set the price and payment amount for the gift (e.g., $10.00)
    const priceAmount = 1000; // $10 in cents

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Vip Membership Gift' },
            unit_amount: priceAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/payments/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/payments/paymentCancel`,
      metadata: {
        gifterId,
        recipientId,
      },
    });

    await PaymentModel.query().insert({
      userId: gifterId,
      recipientId: recipientId,
      stripeSessionId: session.id,
      amount: 1000,
      currency: 'usd',
      status: Statuses.pending,
    });

    return { url: session.url };
  }
}
