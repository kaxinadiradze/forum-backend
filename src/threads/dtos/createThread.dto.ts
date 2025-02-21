import { IsNotEmpty, IsString, MaxLength, IsUUID } from 'class-validator';

export class CreateThreadDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}
