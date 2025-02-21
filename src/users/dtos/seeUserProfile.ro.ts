import { Expose } from 'class-transformer';

export class SeeUserProfileRo {
  @Expose()
  id: string;
  @Expose()
  username: string;
  @Expose()
  bio: string;
  @Expose()
  avatarUrl: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
