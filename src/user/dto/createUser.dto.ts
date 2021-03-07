import { Prisma } from '@prisma/client';
import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto implements Prisma.UserCreateInput {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
