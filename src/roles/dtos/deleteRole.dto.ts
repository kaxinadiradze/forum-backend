import { IsUUID } from 'class-validator';

export class DeleteRoleDto {
  @IsUUID()
  roleId: string;
}
