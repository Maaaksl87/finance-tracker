import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";

import { hashToken } from "../common/utils/hash-token.util";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {} // Додано конструктор для впровадження моделі користувача

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ email: createUserDto.email }).exec();
    if (existing) {
      throw new ConflictException("Користувач з таким email вже існує");
    }
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hash,
    });
    const saved = await createdUser.save();
    return this.findById(saved._id.toString());
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select("-password").exec();
    if (!user) {
      throw new NotFoundException("Користувача не знайдено");
    }
    return user;
  }

  async findByIdWithRefreshToken(id: string): Promise<UserDocument | null> {
    return this.userModel
      .findById(id)
      .select("+hashedRefreshToken -password")
      .exec();
  }

  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = hashToken(refreshToken);
    await this.userModel
      .findByIdAndUpdate(userId, { hashedRefreshToken })
      .exec();
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, { $unset: { hashedRefreshToken: 1 } })
      .exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const updateData = { ...updateUserDto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select("-password")
      .exec();
    if (!user) {
      throw new NotFoundException("Користувача не знайдено");
    }
    return user;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException("Користувача не знайдено");
    }
    return { deleted: true };
  }
}
