import { IsString, IsUUID } from 'class-validator';

export class BanUserDto {
  @IsString()
  @IsUUID()
  userId: string;
}
