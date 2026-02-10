import {
  Controller,
  Post,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Req() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
}

//todo: переглянути можливість розділення логіки для реєстрації та логіну, можливо створити окремий контролер для реєстрації, а в auth.controller залишити лише логін та отримання профілю
