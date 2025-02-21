import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  token: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
