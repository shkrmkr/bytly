import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserModel implements User {
  @Exclude()
  id: number;

  email: string;

  @Exclude()
  password: string;

  @Exclude()
  tokenVersion: number;
}
