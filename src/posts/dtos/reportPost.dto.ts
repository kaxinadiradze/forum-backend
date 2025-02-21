import { MinLength, MaxLength, IsString, IsNotEmpty } from 'class-validator';

export class ReportPostDto {
  @MinLength(10)
  @MaxLength(1000)
  @IsString()
  @IsNotEmpty()
  reason: string;
}
