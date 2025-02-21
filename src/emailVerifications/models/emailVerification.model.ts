import { BaseModel } from 'src/database/basemodel';

export class EmailVerificationModel extends BaseModel {
  static readonly tableName = 'email_verifications';

  id!: string;
  userId!: string;
  newEmail!: string;
  verificationToken!: string;
  tokenExpiresAt!: Date;
}
