import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model, Types } from "mongoose";

import { CreateSourceDto } from "./dto/create-source.dto";
import { UpdateSourceDto } from "./dto/update-source.dto";
import { Source } from "./schemas/source.schema";

@Injectable()
export class SourcesService {
  constructor(@InjectModel(Source.name) private sourceModel: Model<Source>) {}

  async create(createSourceDto: CreateSourceDto, userId: string) {
    const newSource = new this.sourceModel({
      ...createSourceDto,
      userId: new Types.ObjectId(userId),
    });
    return newSource.save();
  }

  async findAll(userId: string) {
    return this.sourceModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async findOne(id: string, userId: string) {
    const source = await this.sourceModel
      .findOne({ _id: id, userId: new Types.ObjectId(userId) })
      .exec();
    if (!source) throw new NotFoundException("Джерело не знайдено");
    return source;
  }

  async update(id: string, updateSourceDto: UpdateSourceDto, userId: string) {
    const updatedSource = await this.sourceModel
      .findOneAndUpdate(
        { _id: id, userId: new Types.ObjectId(userId) },
        updateSourceDto,
        { new: true },
      )
      .exec();
    if (!updatedSource) throw new NotFoundException("Джерело не знайдено");
    return updatedSource;
  }

  async remove(id: string, userId: string) {
    const source = await this.sourceModel
      .findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) })
      .exec();
    if (!source) throw new NotFoundException("Схоже, що такого джерела не існує");
    return source;
  }

  // delta це сума зміни (наприклад, -100 або +500)
  // session - опціональна MongoDB сесія для атомарних транзакцій
  async changeBalance(
    id: string,
    delta: number,
    userId: string,
    session?: ClientSession,
  ): Promise<Source> {
    const updatedSource = await this.sourceModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(userId) },
      { $inc: { balance: delta } },
      { new: true, session },
    );

    if (!updatedSource)
      throw new NotFoundException(`Джерело з ID ${id} не знайдено для цього користувача`);
    return updatedSource;
  }
}
