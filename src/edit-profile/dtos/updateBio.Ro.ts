import { Exclude, Expose } from 'class-transformer';
export class UpdateBioRo {
  @Expose()
  id: string;
  @Expose()
  username: string;
  @Expose()
  email: string;
  @Exclude()
  password: string;
  @Expose()
  bio: string;
  @Expose()
  avatarUrl: string;
  @Expose()
  createdAt: Date;
}
