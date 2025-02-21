import * as nodemailer from 'nodemailer';

export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kazmenmishmena@gmail.com',
        pass: 'qatyidkgvvguydue',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendResetToken(to: string, token: string) {
    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: '"Password Reset" <kazmenmishmena@gmail.com>',
      to,
      subject: 'Password Reset',
      text: `Click the link to reset your password: ${resetLink}`,
    });
  }

  async sendEmailVerification(to: string, token: string) {
    const resetLink = `http://localhost:3000/auth/verify-email?token=${token}`;
    await this.transporter.sendMail({
      from: '"Email Verification" <kazmenmishmena@gmail.com>',
      to,
      subject: 'Email Verification',
      text: `Click the link to verify your email: ${resetLink}`,
    });
  }

  async sendOtpOnEmail(to: string, otp: string) {
    await this.transporter.sendMail({
      from: '"Otp Code" <kazmenmishmena@gmail.com>',
      to,
      subject: 'Otp Code',
      text: `Your otp is ${otp}`,
    });
  }
}
