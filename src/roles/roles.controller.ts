import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateRoleDto } from './dtos/createRole.dto';
import { RolesService } from './roles.service';
import { StripeService } from 'src/stripe/stripe.service';
import { UsersRepository } from 'src/users/users.repository';
import { DeleteRoleDto } from './dtos/deleteRole.dto';
import { RevokeRoleDto } from './dtos/revokeRole.dto';
@UseGuards(AdminGuard)
@Controller('roles')
export class RolesController {
  constructor(
    private rolesService: RolesService,
    private stripeService: StripeService,
    private usersRepository: UsersRepository,
  ) {}

  @UseGuards(AdminGuard)
  @Post()
  async createRole(@Body() body: CreateRoleDto) {
    const role = await this.rolesService.create(body.name);
    return role;
  }

  @UseGuards(AdminGuard)
  @Post('/delete')
  async deleteRole(@Body() body: DeleteRoleDto) {
    return await this.rolesService.deleteById(body.roleId);
  }

  @Post('revoke-role')
  async revokeRole(@Body() body: RevokeRoleDto) {
    return await this.rolesService.revokeRole(body.userId, body.roleId);
  }
}
