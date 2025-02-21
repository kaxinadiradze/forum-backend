import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReportStatuses } from '../reports.repository';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsEnum(ReportStatuses)
  status: ReportStatuses;
}
