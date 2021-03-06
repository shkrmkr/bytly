import { Prisma } from '@prisma/client';

export class CreateUserDto implements Prisma.UserCreateInput {
  email: string;
  password: string;
}
