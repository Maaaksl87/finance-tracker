import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from 'src/users/schemas/user.schema';

export type AuthJwtPayload = {
  sub: string;
  email: string;
  name: string;
};

export type UserWithoutPassword = Omit<User, 'password'> & { _id: string };

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // Інжектимо сервіс юзерів
    private jwtService: JwtService, // Інжектимо сервіс для токенів
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pwd, ...result } = user.toObject();
      return { ...result, _id: result._id.toString() };
    }

    return null;
  }

  login(user: UserWithoutPassword) {
    const payload: AuthJwtPayload = {
      email: user.email,
      sub: user._id,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
