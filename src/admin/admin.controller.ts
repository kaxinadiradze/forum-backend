import { Controller, Body, Post, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { TransferAdminDto } from './dtos/admin.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { BanUserDto } from './dtos/banUser.dto';
import { BanGuard } from 'src/guards/ban.guard';

@UseGuards(AdminGuard)
@UseGuards(BanGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('all-admins')
  async seeAdmins() {
    const seeAdmins = await this.adminService.seeAdmins();
    return seeAdmins;
  }

  @Post('give-admin')
  async giveAdmin(@Body() body: TransferAdminDto) {
    const giveAdmin = await this.adminService.giveAdmin(body.userId);
    return giveAdmin;
  }

  @Post('ban-user')
  async banUser(@Body() body: BanUserDto) {
    return await this.adminService.banUser(body.userId);
  }

  @Post('unban-user')
  async unbanUser(@Body() body: BanUserDto) {
    return await this.adminService.unbanUser(body.userId);
  }

  @Post('remove-admin')
  async removeAdmin(@Body() body: BanUserDto) {
    return await this.adminService.removeAdmin(body.userId);
  }
}
