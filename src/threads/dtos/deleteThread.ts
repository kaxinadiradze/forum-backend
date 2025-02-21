import { IsString, IsUUID } from 'class-validator';

export class DeleteThreadDto {
  @IsString()
  @IsUUID()
  id: string;
}
