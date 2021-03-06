import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        categories: {
          create: [{ title: 'default' }],
        },
      },
    });
  }

  async getUniqueUser(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where });
  }

  async revokeRefreshToken(id: Prisma.UserWhereUniqueInput['id']) {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { tokenVersion: { increment: 1 } },
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
