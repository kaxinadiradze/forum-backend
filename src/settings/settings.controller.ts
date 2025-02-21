import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { Request } from 'src/users/users.controller';
import { SettingsService } from './settings.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ChangeEmailDto } from './dtos/changeEmail.dto';
import { OtpDto } from './dtos/Otp.dto';
import { BanGuard } from 'src/guards/ban.guard';

@UseGuards(AuthGuard)
@UseGuards(BanGuard)
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}
  @Post('/change-password')
  async changePassword(@Body() body: ChangePasswordDto, @Req() req: Request) {
    const userId = req.currentUser.id;
    const changePassword = await this.settingsService.changePassword(
      body.currentPassword,
      body.newPassword,
      userId,
    );

    return changePassword;
  }

  @Post('/switch-otp')
  async switchOtp(@Body('') body: OtpDto, @Req() req: Request) {
    const userId = req.currentUser.id;
    const manageOtp = await this.settingsService.switchOtp(
      userId,
      body.isEnabled,
    );
    return manageOtp;
  }

  @Post('/change-email')
  async changeEmail(@Body() body: ChangeEmailDto, @Req() req: Request) {
    const userId = req.currentUser.id;
    const changeEmail = await this.settingsService.changeEmail(
      userId,
      body.email,
    );
    return changeEmail;
  }
}
