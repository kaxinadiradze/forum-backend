import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class EditPostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;
}
