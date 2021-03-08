import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
    const user = await this.userService.getUniqueUser({ email });
    const isPasswordValid = user
      ? await this.verifyPassword(user.password, password)
      : false;

    if (!user || !isPasswordValid) {
      throw new BadRequestException('올바르지 않은 이메일 또는 비밀번호입니다');
    }

    return user;
  }

  async register(data: CreateUserDto): Promise<boolean> {
    const isEmailPresent = await this.userService.getUniqueUser({
      email: data.email,
    });

    if (isEmailPresent) {
      throw new ConflictException('이미 존재하는 이메일 주소입니다');
    }

    const hashedPassword = await this.hashPassword(data.password);
    await this.userService.create({ ...data, password: hashedPassword });
    return true;
  }

  getAccessToken(user: User): string {
    return this.jwtService.sign(
      { userId: user.id },
      {
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      },
    );
  }

  getRefreshToken(user: User): string {
    return this.jwtService.sign(
      { userId: user.id },
      {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      },
    );
  }
}
