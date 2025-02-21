import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateBioDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  bio: string;
}
