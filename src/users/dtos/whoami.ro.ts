import { Expose } from 'class-transformer';
export class WhoamiRo {
  @Expose()
  id: string;
  @Expose()
  username: string;
  @Expose()
  email: string;
  @Expose()
  bio: string;
  @Expose()
  avatarUrl: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
