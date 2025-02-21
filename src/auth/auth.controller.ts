import { Controller, Post, Body, Get, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signUp.dto';
import { SignInDto } from './dtos/signIn.dto';
import { RequestTokenDto } from './dtos/requestToken.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { SettingsService } from 'src/settings/settings.service';
import { Request } from 'src/users/users.controller';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
  ) {}

  @Get('/reset-password')
  async verifyToken(@Query('token') token: string) {
    const verifyToken = await this.authService.verifyToken(token);
    return verifyToken;
  }

  @Get('/verify-email')
  async verifyEmail(@Query('token') token: string, @Req() req: Request) {
    const verify = await this.settingsService.verifyEmail(token);
    return verify;
  }

  @Post('/signup')
  async signUp(@Body() body: SignUpDto) {
    const jwtOfUser = await this.authService.signUp(body);
    return jwtOfUser;
  }

  @Post('/signin')
  async signIn(@Body() body: SignInDto) {
    const user = await this.authService.signIn(body);
    return user;
  }

  @Post('reset-password-request')
  async resetPasswordRequest(@Body() body: RequestTokenDto) {
    const resetPasswordRequest = await this.authService.resetPasswordRequest(
      body.email,
    );
    return resetPasswordRequest;
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    const resetPassword = await this.authService.resetPassword(
      body.token,
      body.password,
    );
    return resetPassword;
  }
}
