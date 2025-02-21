import { IsString, IsNotEmpty, MinLength } from 'class-validator';
export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  currentPassword: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  newPassword: string;
}
