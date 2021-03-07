import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { AuthService } from './auth.service';
import { RequestWithUser } from './interface/requestWithUser.interface';
import { JwtAuthGuard } from './jwtAuth.guard';
import { LocalAuthGuard } from './localAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  login(@Req() req: RequestWithUser) {
    const token = this.authService.getToken({ userId: req.user.id });

    req.res
      .cookie('jid', token, {
        maxAge: this.configService.get('JWT_EXPIRES_IN') * 1000,
        httpOnly: true,
        path: '/',
      })
      .send();
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Req() req: RequestWithUser,
  ) {
    const user = await this.authService.register(createUserDto);
    const token = this.authService.getToken({ userId: user.id });

    req.res
      .cookie('jid', token, {
        maxAge: this.configService.get('JWT_EXPIRES_IN') * 1000,
        httpOnly: true,
        path: '/',
      })
      .send();
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    req.res
      .cookie('jid', '', {
        httpOnly: true,
        path: '/',
        secure: false,
        maxAge: 0,
      })
      .send();
  }
}
