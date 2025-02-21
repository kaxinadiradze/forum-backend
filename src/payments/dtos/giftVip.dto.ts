import { IsNotEmpty, IsUUID } from 'class-validator';

export class GiftVipDto {
  @IsUUID()
  @IsNotEmpty()
  recipientId: string;
}
