import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeletePostDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
