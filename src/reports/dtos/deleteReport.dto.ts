import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteReportDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
