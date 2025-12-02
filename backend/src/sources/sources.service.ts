import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Source } from './schemas/source.schema';
import { Model, ClientSession } from 'mongoose';

@Injectable()
export class SourcesService {
  constructor(@InjectModel(Source.name) private sourceModel: Model<Source>) {}

  async create(createSourceDto: CreateSourceDto, userId: string) {
    const newSource = new this.sourceModel({
      ...createSourceDto, // spread the DTO properties (name, balance)
      userId, // associate the source with the user creating it
    });
    return newSource.save(); // save to DB
  }

  async findAll(userId: string) {
    return this.sourceModel.find({ userId }).exec(); // find all sources for the given user
  }

  async findOne(id: string, userId: string) {
    return this.sourceModel.findOne({ _id: id, userId }).exec(); // check both source ID and user ID
  }

  async update(id: string, updateSourceDto: UpdateSourceDto, userId: string) {
    return this.sourceModel
      .findOneAndUpdate(
        { _id: id, userId }, // ensure the source belongs to the user
        updateSourceDto,
        { new: true }, // return the updated document
      )
      .exec();
  }

  async remove(id: string, userId: string) {
    return this.sourceModel.findOneAndDelete({ _id: id, userId }).exec(); // ensure the source belongs to the user
  }

  // delta це сума зміни (наприклад, -100 або +500)
  // session - опціональна MongoDB сесія для атомарних транзакцій
  async changeBalance(
    id: string,
    delta: number,
    userId: string,
    session?: ClientSession,
  ) {
    const source = await this.sourceModel
      .findOne({ _id: id, userId })
      .session(session ?? null); // Використовуємо сесію якщо передана

    if (!source) {
      throw new NotFoundException(`Source with ID ${id} not found`);
    }

    const newBalance = source.balance + delta;

    // Перевіряємо чи достатньо коштів для витрати
    if (newBalance < 0) {
      throw new BadRequestException(
        `Insufficient balance. Current: ${source.balance}, required: ${Math.abs(delta)}`,
      );
    }

    source.balance = newBalance;
    return source.save({ session }); // Зберігаємо з сесією для атомарності
  }
}
