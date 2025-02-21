import { IsNotEmpty, IsUUID } from 'class-validator';

export class RevokeRoleDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
  @IsUUID()
  @IsNotEmpty()
  roleId: string;
}
