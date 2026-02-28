import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDto } from 'src/users/dto/create-user.dto';

import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Req() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
}
