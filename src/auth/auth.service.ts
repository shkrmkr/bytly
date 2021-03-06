import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne({ email });
    const isPasswordValid = user
      ? await this.userService.comparePassword(user.password, password)
      : false;

    if (!user || !isPasswordValid) {
      throw new BadRequestException(
        '올바르지 않은 이메일 또는 비밀번호입니다.',
      );
    }

    return user;
  }
}
