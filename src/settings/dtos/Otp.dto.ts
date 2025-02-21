import { IsBoolean } from 'class-validator';
export class OtpDto {
  @IsBoolean()
  isEnabled: boolean;
}
