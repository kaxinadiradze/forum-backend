import { Exclude, Expose } from 'class-transformer';
export class SignInRo {
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
  @Exclude()
  updatedAt: Date;
}
