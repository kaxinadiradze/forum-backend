import { IsString, IsUUID } from 'class-validator';

export class TransferAdminDto {
  @IsString()
  @IsUUID()
  userId: string;
}
