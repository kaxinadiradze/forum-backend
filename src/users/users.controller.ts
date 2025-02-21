import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { UserModel } from './models/user.model';
import { WhoamiRo } from './dtos/whoami.ro';
import { plainToInstance } from 'class-transformer';
import { UsersService } from './users.service';
import { SeeUserProfileRo } from './dtos/seeUserProfile.ro';
import { AuthGuard } from 'src/guards/auth.guard';
import { BanGuard } from 'src/guards/ban.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { ReportUserDto } from './dtos/reportUser.dto';
import { ReportsService } from 'src/reports/reports.service';

export interface Request {
  currentUser: UserModel;
}

@UseGuards(AuthGuard)
@UseGuards(BanGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private reportsService: ReportsService,
  ) {}
  @Get('/whoami')
  whoami(@Req() req: Request): Promise<WhoamiRo> {
    const user = req.currentUser;
    const whoami = plainToInstance(WhoamiRo, user, {
      excludeExtraneousValues: true,
    });
    console.log('user: ', user);
    console.log('whoamiRo: ', whoami);

    return Promise.resolve(whoami);
  }

  @Get('/:userId')
  async seeUserProfile(
    @Param('userId') userId: string,
  ): Promise<SeeUserProfileRo> {
    const user = await this.usersService.findById(userId);
    const ro = plainToInstance(SeeUserProfileRo, user, {
      excludeExtraneousValues: true,
    });
    return Promise.resolve(ro);
  }

  @Get('/:userId/posts')
  async seeUsersPosts(@Param('userId') userId: string) {
    const posts = await this.usersService.findUserPosts(userId);
    return posts;
  }

  @UseGuards(AdminGuard)
  @Get('/delete/:userId')
  async deleteUser(@Param('userId') userId: string) {
    const deleteUser = await this.usersService.deleteById(userId);
    return deleteUser;
  }

  @Post('/:userId/report')
  async reportUser(
    @Param('userId') userId: string,
    @Body() body: ReportUserDto,
    @Req() req: Request,
  ) {
    const reporterId = req.currentUser.id;
    const report = await this.reportsService.reportUser({
      reporterId,
      reportedUserId: userId,
      reason: body.reason,
    });

    return report;
  }
}
