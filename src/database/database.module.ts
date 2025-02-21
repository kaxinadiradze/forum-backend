import { Global, Module } from '@nestjs/common';
import Knex from 'knex';
import { knexSnakeCaseMappers, Model } from 'objection';
import * as knexConfig from '../../knexfile';
import * as dotenv from 'dotenv';
import { UserModel } from 'src/users/models/user.model';
import { ResetTokenModel } from 'src/resetTokens/resetToken.model';
import { EmailVerificationModel } from 'src/emailVerifications/models/emailVerification.model';
import { OtpModel } from 'src/otps/models/otp.model';
import { AdminModel } from 'src/admin/models/admin.model';
import { CategoryModel } from 'src/categories/models/category.model';
import { ThreadModel } from 'src/threads/models/thread.model';
import { PostModel } from 'src/posts/models/post.model';
import { LikeModel } from 'src/likes/models/like.model';
import { RoleModel } from 'src/roles/models/role.model';
import { UserRoleModel } from 'src/user-roles/models/models/userRole.model';
import { PaymentModel } from 'src/payments/models/payment.model';
import { ReportModel } from 'src/reports/models/report.model';
dotenv.config();

// List of models to be injected as providers
const models = [
  UserModel,
  ResetTokenModel,
  EmailVerificationModel,
  OtpModel,
  AdminModel,
  CategoryModel,
  ThreadModel,
  PostModel,
  LikeModel,
  RoleModel,
  UserRoleModel,
  PaymentModel,
  ReportModel,
];

// Map the models to providers
const modelProviders = models.map((model) => ({
  provide: model.name,
  useValue: model,
}));

// Knex connection provider
const knexConnectionProvider = {
  provide: 'KnexConnection',
  useFactory: async () => {
    const environment = process.env.NODE_ENV || 'development';
    const knexConfigForEnv = knexConfig[environment];

    if (!knexConfigForEnv || !knexConfigForEnv.connection) {
      throw new Error(
        `Knex configuration for environment "${environment}" is not defined.`,
      );
    }

    const knex = Knex({
      client: 'pg',
      connection: knexConfigForEnv.connection,
      debug: process.env.KNEX_DEBUG === 'true',
      ...knexSnakeCaseMappers(),
    });

    // Set the knex instance globally for Objection.js
    Model.knex(knex);
    return knex;
  },
};

@Global()
@Module({
  providers: [
    ...modelProviders,
    knexConnectionProvider,
    {
      provide: 'KnexInstance',
      useFactory: () => {
        const knexInstance = Knex({
          client: 'pg',
          connection: process.env.DATABASE_URL,
        });

        // Set the knex instance globally for Objection.js
        Model.knex(knexInstance);
        return knexInstance;
      },
    },
  ],
  exports: [...modelProviders, 'KnexInstance'],
})
export class DatabaseModule {}
