import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { compare } from "bcrypt";

import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/schemas/user.schema";

import { tokensMatch } from "../common/utils/hash-token.util";
import { UsersService } from "../users/users.service";

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

export type UserWithoutPassword = Omit<User, "password"> & {
  _id: string;
};

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

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

  private signAccessToken(payload: AuthJwtPayload): string {
    return this.jwtService.sign(payload);
  }

  private signRefreshToken(payload: AuthJwtPayload): string {
    const secret = this.configService.get<string>("JWT_REFRESH_SECRET");
    if (!secret) {
      throw new Error("JWT_REFRESH_SECRET must be defined");
    }

    return this.jwtService.sign(payload, {
      secret,
      expiresIn: (this.configService.get<string>("JWT_REFRESH_TOKEN_TTL") ??
        "7d") as JwtSignOptions["expiresIn"],
    });
  }

  async login(user: LoginUser): Promise<AuthTokens> {
    const payload: AuthJwtPayload = {
      email: user.email,
      sub: user._id,
      name: user.name,
    };

    const access_token = this.signAccessToken(payload);
    const refresh_token = this.signRefreshToken(payload);

    await this.usersService.setRefreshToken(user._id, refresh_token);

    return { access_token, refresh_token };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens> {
    const user = await this.usersService.findByIdWithRefreshToken(userId);

    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException("Доступ заборонено");
    }

    const matches = tokensMatch(refreshToken, user.hashedRefreshToken);
    if (!matches) {
      throw new ForbiddenException("Доступ заборонено");
    }

    return this.login({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    });
  }

  async logout(userId: string): Promise<{ loggedOut: boolean }> {
    await this.usersService.removeRefreshToken(userId);
    return { loggedOut: true };
  }
}
