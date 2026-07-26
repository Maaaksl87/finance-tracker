import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { ClientSession, Connection, Model, Types } from "mongoose";

import { Transaction, TransactionType } from "../transactions/schemas/transaction.schema";
import { CreateSourceDto } from "./dto/create-source.dto";
import { UpdateSourceDto } from "./dto/update-source.dto";
import { Source } from "./schemas/source.schema";

@Injectable()
export class SourcesService {
  constructor(
    @InjectModel(Source.name) private sourceModel: Model<Source>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectConnection() private connection: Connection,
  ) { }

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
    const session: ClientSession = await this.connection.startSession();

    try {
      return await session.withTransaction(async () => {
        const source = await this.sourceModel
          .findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) }, { session })
          .exec();
        if (!source) throw new NotFoundException("Схоже, що такого джерела не існує");

        const relatedTransactions = await this.transactionModel
          .find(
            { userId: new Types.ObjectId(userId), $or: [{ sourceId: id }, { destinationSourceId: id }] },
            null,
            { session },
          )
          .exec();

        for (const t of relatedTransactions) {
          if (t.type !== TransactionType.TRANSFER) continue;

          if (t.sourceId.toString() === id && t.destinationSourceId?.toString() !== id) {
            await this.changeBalance(t.destinationSourceId!.toString(), -t.amount, userId, session);
          } else if (t.destinationSourceId?.toString() === id && t.sourceId.toString() !== id) {
            await this.changeBalance(t.sourceId.toString(), t.amount, userId, session);
          }
        }

        await this.transactionModel.deleteMany(
          { userId: new Types.ObjectId(userId), $or: [{ sourceId: id }, { destinationSourceId: id }] },
          { session },
        );

        return source;
      });
    } finally {
      await session.endSession();
    }
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
