import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';
import { ResetTokenModel } from 'src/resetTokens/resetToken.model';
import { MailerService } from 'src/mailer/mailer.service';
import { UserModel } from 'src/users/models/user.model';
import { OtpModel } from 'src/otps/models/otp.model';
import { Roles } from 'src/roles/roles.repository';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signUp(signUpData: SignUpData) {
    const trx = await UserModel.startTransaction();
    try {
      const usernameExist = await this.usersRepository.findByUsername(
        signUpData.username,
      );
      if (usernameExist) {
        throw new BadRequestException('Username is already used');
      }
      const emailExist = await this.usersRepository.findByEmail(
        signUpData.email,
      );
      if (emailExist) {
        throw new BadRequestException('Email is in use');
      }
      const password = signUpData.password;
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      const result = salt + '.' + hash.toString('hex');
      signUpData.password = result;
      const user = await this.usersRepository.create(signUpData, trx);
      const userId = user.id;
      await this.usersRepository.assignRoleToUser(userId, Roles.member, trx);
      await trx.commit();
      const jwt = await this.generateJwt(userId);
      return jwt;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async signIn(signInData: SignInData) {
    const user = await this.usersRepository.findByEmail(signInData.email);
    if (!user) {
      throw new NotFoundException('User with this email addres not found.');
    }
    const passwd = signInData.password;
    const [salt, userPassword] = user.password.split('.');
    const hash = (await scrypt(passwd, salt, 32)) as Buffer;
    if (hash.toString('hex') !== userPassword) {
      throw new BadRequestException('Incorrect password.');
    }
    if (user.twoStepEnabled === true) {
      if (!signInData.otp) {
        const checkOtpIfExist = await OtpModel.query().findOne({
          email: signInData.email,
        });
        if (checkOtpIfExist && checkOtpIfExist.expiresAt > new Date()) {
          throw new BadRequestException('otp is required');
        } else if (checkOtpIfExist && checkOtpIfExist.expiresAt < new Date()) {
          await OtpModel.query().deleteById(checkOtpIfExist.id);
        }
        await this.generateOtp(signInData.email);
        return { message: `otp code successfully sent to ${signInData.email}` };
      }
      await this.VerifyOtp(signInData.email, signInData.otp);
    }
    const jwt = await this.generateJwt(user.id);
    const { password, ...all } = user;
    return { userData: all, token: jwt };
  }

  async generateJwt(userId: string) {
    const token = await this.jwtService.signAsync({ userId });
    return token;
  }

  async resetPasswordRequest(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user)
      throw new NotFoundException('user with that email does not exist');
    const resetToken = uuidv4();
    const expiresAt = addHours(new Date(), 1);
    const existingToken = await ResetTokenModel.query().findOne({
      email,
      userId: user.id,
    });
    if (existingToken) {
      if (existingToken.resetTokenExpiresAt < new Date()) {
        await ResetTokenModel.query().deleteById(existingToken.id);
      }
      if (existingToken.resetTokenExpiresAt > new Date()) {
        return { message: 'reset token was already sent, try again in 1 hour' };
      }
    }

    await ResetTokenModel.query().insert({
      email,
      userId: user.id,
      resetTokenExpiresAt: expiresAt,
      resetToken,
    });

    await this.mailerService.sendResetToken(email, resetToken);
    return { message: `The password reset token was sent to ${email}` };
  }

  async verifyToken(token: string) {
    const verifyToken = await ResetTokenModel.query().findOne(
      'resetToken',
      token,
    );
    if (!verifyToken || verifyToken.resetTokenExpiresAt < new Date()) {
      if (verifyToken.id) {
        await ResetTokenModel.query().deleteById(verifyToken.id);
      }
      return 'Token is invalid or expired';
    }
    return { message: `token: ${token} - token is valid` };
  }

  async resetPassword(token: string, password: string) {
    const verifyToken = await ResetTokenModel.query().findOne(
      'resetToken',
      token,
    );
    if (!verifyToken || verifyToken.resetTokenExpiresAt < new Date()) {
      if (verifyToken) {
        await ResetTokenModel.query().deleteById(verifyToken.id);
      }
      return 'Token is invalid or expired';
    }
    const userId = verifyToken.userId;
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    await UserModel.query().patchAndFetchById(userId, {
      password: result,
    });
    await ResetTokenModel.query().deleteById(verifyToken.id);
    return { message: 'password reset completed successfully' };
  }

  async generateOtp(email: string) {
    const emailExist = await this.usersRepository.findByEmail(email);
    if (!emailExist) {
      throw new NotFoundException('user with that email not found');
    }
    await OtpModel.query().where('email', email).delete();

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await OtpModel.query().insert({ email, otp, expiresAt });
    await this.mailerService.sendOtpOnEmail(email, otp);
    return otp;
  }

  async VerifyOtp(email: string, otp: string) {
    const otpVerify = await OtpModel.query().where({ email, otp }).first();
    if (!otpVerify) {
      const otpRecord = await OtpModel.query().where('email', email).first();
      if (!otpRecord) {
        throw new NotFoundException('No OTP request found for this email.');
      }
      const attempts = otpRecord.attempts;
      if (attempts >= 3) {
        await OtpModel.query().deleteById(otpRecord.id);
        throw new BadRequestException(
          'you were already tried 3 times, send new code and try again later',
        );
      }
      await OtpModel.query().patchAndFetchById(otpRecord.id, {
        attempts: attempts + 1,
      });
      throw new NotFoundException('invalid code');
    }
    if (otpVerify.expiresAt < new Date()) {
      await OtpModel.query().deleteById(otpVerify.id);
      throw new BadRequestException('otp is expired');
    }
    await OtpModel.query().deleteById(otpVerify.id);
    return { message: 'OTP verified successfully' };
  }
}

export type SignUpData = {
  username: string;
  email: string;
  password: string;
};

export type SignInData = {
  email: string;
  password: string;
  otp?: string;
};
