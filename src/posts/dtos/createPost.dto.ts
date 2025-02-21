import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;
  @IsUUID()
  @IsNotEmpty()
  threadId: string;
  @IsOptional()
  @IsUUID()
  parentPostId: string;
}
