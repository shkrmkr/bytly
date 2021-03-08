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
import { LoginResponse } from './interface/loginResponse';
import { RequestWithUser } from './interface/requestWithUser.interface';
import { JwtAccessTokenGuard } from './jwtAccessToken.guard';
import { JwtRefreshTokenGuard } from './jwtRefreshToken.guard';
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
  login(@Req() req: RequestWithUser): LoginResponse {
    const accessToken = this.authService.getAccessToken(req.user);
    const refreshToken = this.authService.getRefreshToken(req.user);

    req.res.cookie('jid', refreshToken, { httpOnly: true });
    return { accessToken };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAccessTokenGuard)
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

  @UseGuards(JwtAccessTokenGuard)
  @Get('check-access')
  check(@Req() req: RequestWithUser) {
    return `Your user id is ${req.user.id}`;
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  refreshToken(@Req() req: Request) {
    console.log(req.headers);
  }
}
