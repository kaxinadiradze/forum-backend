import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
export class ReportUserDto {
  @MinLength(10)
  @MaxLength(1000)
  @IsString()
  @IsNotEmpty()
  reason: string;
}
