import { BaseModel } from 'src/database/basemodel';

export class OtpModel extends BaseModel {
  static readonly tableName = 'otps';

  id!: string;
  userId!: string;
  email!: string;
  otp!: string;
  expiresAt!: Date;
  attempts: number;
}
