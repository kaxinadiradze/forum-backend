import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { DatabaseModule } from './database/database.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EditProfileModule } from './edit-profile/edit-profile.module';
import { SettingsModule } from './settings/settings.module';
import { AdminModule } from './admin/admin.module';
import { CategoriesModule } from './categories/categories.module';
import { ThreadsModule } from './threads/threads.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { RolesModule } from './roles/roles.module';
import { StripeService } from './stripe/stripe.service';
import { RolesRepository } from './roles/roles.repository';
import { StripeModule } from './stripe/stripe.module';
import { PaymentsModule } from './payments/payments.module';
import { ReportsModule } from './reports/reports.module';

dotenv.config();
@Module({
  imports: [
    UsersModule,
    AuthModule,
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../uploads/avatars'),
      serveRoot: '/uploads/avatars',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
      global: true,
    }),
    EditProfileModule,
    SettingsModule,
    AdminModule,
    CategoriesModule,
    ThreadsModule,
    PostsModule,
    LikesModule,
    RolesModule,
    StripeModule,
    PaymentsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService, StripeService, RolesRepository],
})
export class AppModule {}
