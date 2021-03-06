import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authSerivce: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<User> {
    return this.authSerivce.validateUser(username, password);
  }
}
