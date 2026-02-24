import { Controller, Get, Body, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Request() req: RequestWithUser) {
    return this.usersService.findById(req.user._id.toString());
  }

  @Patch('me')
  update(@Request() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user._id.toString(), updateUserDto);
  }

  @Delete('me')
  remove(@Request() req: RequestWithUser) {
    return this.usersService.remove(req.user._id.toString());
  }
}
