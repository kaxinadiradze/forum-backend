import { BaseModel } from 'src/database/basemodel';

export class PaymentModel extends BaseModel {
  static readonly tableName = 'payments';

  id!: string;
  userId!: string;
  stripeSessionId!: string;
  recipientId!: string;
  amount!: number;
  currency!: string;
  status!: string;
  createdAt!: Date;
}
