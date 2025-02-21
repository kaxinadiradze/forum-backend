import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserModel } from 'src/users/models/user.model';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';
import { EmailVerificationModel } from 'src/emailVerifications/models/emailVerification.model';
import { MailerService } from 'src/mailer/mailer.service';
const scrypt = promisify(_scrypt);
@Injectable()
export class SettingsService {
  constructor(
    private usersService: UsersService,
    private usersRepository: UsersRepository,
    private mailerService: MailerService,
  ) {}
  async changePassword(
    currentPassword: string,
    newpassword: string,
    userId: string,
  ) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('user not found');
    const [salt, userPassword] = user.password.split('.');
    const hash = (await scrypt(currentPassword, salt, 32)) as Buffer;
    if (hash.toString('hex') !== userPassword) {
      throw new BadRequestException('Current password is incorrect');
    }
    const newSalt = randomBytes(8).toString('hex');
    const hashNewPassword = (await scrypt(newpassword, newSalt, 32)) as Buffer;
    const result = newSalt + '.' + hashNewPassword.toString('hex');
    await UserModel.query().patchAndFetchById(userId, {
      password: result,
    });
    return { message: 'Password changed successfully' };
  }

  async changeEmail(userId: string, newEmail: string) {
    const currentUser = await this.usersService.findById(userId);
    if (!currentUser) throw new NotFoundException('user not found');
    const emailExistCheck = await this.usersRepository.findByEmail(newEmail);
    if (emailExistCheck) throw new BadRequestException('email in use');
    const verificationToken = uuidv4();
    const expiresAt = addHours(new Date(), 1);
    const existingToken = await EmailVerificationModel.query().findOne({
      userId,
      newEmail,
    });
    if (existingToken) {
      if (existingToken.tokenExpiresAt < new Date()) {
        await EmailVerificationModel.query().deleteById(existingToken.id);
      }
      if (existingToken.tokenExpiresAt > new Date()) {
        return {
          message: 'email verify token was already sent, try again in 1 hour',
        };
      }
    }
    await EmailVerificationModel.query().insert({
      userId,
      newEmail,
      verificationToken,
      tokenExpiresAt: expiresAt,
    });

    await this.mailerService.sendEmailVerification(newEmail, verificationToken);
    return {
      message: `The email verification link was successfully sent to ${newEmail}`,
    };
  }

  async verifyEmail(token: string) {
    const verifyToken = await EmailVerificationModel.query()
      .where('verificationToken', token)
      .first();
    if (!verifyToken) {
      throw new NotFoundException('Verification token is invalid');
    }
    if (verifyToken && verifyToken.tokenExpiresAt < new Date()) {
      await EmailVerificationModel.query().deleteById(verifyToken.id);
      throw new BadRequestException('Verification token is expired');
    }
    await UserModel.query().patchAndFetchById(verifyToken.userId, {
      email: verifyToken.newEmail,
    });

    await EmailVerificationModel.query().deleteById(verifyToken.id);
    return { message: 'Email verified and updated successfully' };
  }

  async switchOtp(userId: string, isEnabled: boolean) {
    if (isEnabled === false) {
      await UserModel.query().patchAndFetchById(userId, {
        twoStepEnabled: false,
      });
      return { message: 'Otp switched to off' };
    }

    if (isEnabled === true) {
      await UserModel.query().patchAndFetchById(userId, {
        twoStepEnabled: true,
      });
      return { message: 'Otp switched to on' };
    }
  }
}
