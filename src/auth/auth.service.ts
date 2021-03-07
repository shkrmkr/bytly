import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interface/jwtPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private verifyPassword(
    hashedPassword: string,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findUniqueOne({ email });
    const isPasswordValid = user
      ? await this.verifyPassword(user.password, password)
      : false;

    if (!user || !isPasswordValid) {
      throw new BadRequestException(
        '올바르지 않은 이메일 또는 비밀번호입니다.',
      );
    }

    return user;
  }

  async register(data: CreateUserDto): Promise<User> {
    const isEmailPresent = await this.userService.findUniqueOne({
      email: data.email,
    });

    if (isEmailPresent) {
      throw new ConflictException('이미 존재하는 이메일 주소입니다');
    }

    const hashedPassword = await this.hashPassword(data.password);
    return this.userService.create({ ...data, password: hashedPassword });
  }

  getToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
