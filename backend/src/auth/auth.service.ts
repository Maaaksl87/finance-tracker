import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/schemas/user.schema';

import { UsersService } from '../users/users.service';

export type AuthJwtPayload = {
  sub: string;
  email: string;
  name: string;
};

export type LoginUser = {
  _id: string;
  email: string;
  name: string;
};

export type UserWithoutPassword = Omit<User, 'password'> & {
  _id: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.login({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    });
  }

  login(user: LoginUser) {
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
