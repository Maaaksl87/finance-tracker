import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // Інжектимо сервіс юзерів
    private jwtService: JwtService, // Інжектимо сервіс для токенів
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // Шукаємо юзера в базі
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, name: user.name };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
