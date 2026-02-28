import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientSession } from 'mongoose';
import { Connection } from 'mongoose';

import { SourcesService } from '../sources/sources.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionType } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectConnection() private connection: Connection,
    private sourcesService: SourcesService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    const { type, amount, sourceId, destinationSourceId } = createTransactionDto;

    // Валідація
    if (amount <= 0) {
      throw new BadRequestException('Сума повинна бути додатною');
    }

    if (type === TransactionType.TRANSFER && !destinationSourceId) {
      throw new BadRequestException('Для трансферу потрібно вказати цільове джерело');
    }

    // Використовуємо MongoDB транзакції для атомарності
    const session: ClientSession = await this.connection.startSession();

    try {
      return await session.withTransaction(async () => {
        switch (type) {
          case TransactionType.EXPENSE:
            await this.sourcesService.changeBalance(sourceId, -amount, userId, session);
            break;

          case TransactionType.INCOME:
            await this.sourcesService.changeBalance(sourceId, amount, userId, session);
            break;

          case TransactionType.TRANSFER:
            await this.sourcesService.changeBalance(sourceId, -amount, userId, session);
            await this.sourcesService.changeBalance(
              destinationSourceId!,
              amount,
              userId,
              session,
            );
            break;

          default:
            throw new BadRequestException('Невірний тип транзакції');
        }

        // Створюємо і зберігаємо транзакцію після успішних операцій
        const transaction = new this.transactionModel({
          ...createTransactionDto,
          userId,
        });

        return await transaction.save({ session });
      });
    } finally {
      // закриваємо сесію
      await session.endSession();
    }
  }

  // пагінація та фільтри
  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
    type?: TransactionType,
    sourceId?: string,
  ) {
    const skip = (page - 1) * limit;
    const filter: {
      userId: string;
      type?: TransactionType;
      sourceId?: string;
    } = { userId };

    // Додаємо фільтри за потреби
    if (type) filter.type = type;
    if (sourceId) filter.sourceId = sourceId;

    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate('sourceId', 'name type')
        .populate('destinationSourceId', 'name type')
        .exec(),
      this.transactionModel.countDocuments(filter),
    ]);

    return {
      transactions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.transactionModel
      .findOne({ _id: id, userId })
      .populate('sourceId', 'name type')
      .populate('destinationSourceId', 'name type')
      .exec();

    if (!transaction) {
      throw new NotFoundException(`Транзакцію з ID ${id} не знайдено`);
    }

    return transaction;
  }

  async remove(id: string, userId: string) {
    const transaction = await this.findOne(id, userId);

    const session: ClientSession = await this.connection.startSession();

    try {
      return await session.withTransaction(async () => {
        //Відкочуємо операції при видаленні
        const transactionType = transaction.type;

        switch (transactionType) {
          case TransactionType.EXPENSE:
            // Повертаємо гроші на рахунок
            await this.sourcesService.changeBalance(
              transaction.sourceId.toString(),
              transaction.amount,
              userId,
              session,
            );
            break;

          case TransactionType.INCOME:
            // Знімаємо додані гроші
            await this.sourcesService.changeBalance(
              transaction.sourceId.toString(),
              -transaction.amount,
              userId,
              session,
            );
            break;

          case TransactionType.TRANSFER:
            // Повертаємо гроші на початкове джерело
            await this.sourcesService.changeBalance(
              transaction.sourceId.toString(),
              transaction.amount,
              userId,
              session,
            );
            // Знімаємо з цільового
            await this.sourcesService.changeBalance(
              transaction.destinationSourceId!.toString(),
              -transaction.amount,
              userId,
              session,
            );
            break;
        }

        // Видаляємо транзакцію
        return await this.transactionModel.findByIdAndDelete(id, { session });
      });
    } finally {
      await session.endSession();
    }
  }

  // Метод для отримання статистики
  async getStats(userId: string, startDate?: Date, endDate?: Date) {
    const matchStage: {
      userId: string;
      date?: { $gte?: Date; $lte?: Date };
    } = { userId };

    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = startDate;
      if (endDate) matchStage.date.$lte = endDate;
    }

    interface StatsResult {
      _id: TransactionType;
      total: number;
      count: number;
    }

    const stats = await this.transactionModel.aggregate<StatsResult>([
      { $match: matchStage },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Хелпер для отримання значень
    const getStat = (type: TransactionType) => stats.find((s) => s._id === type);

    return {
      totalIncome: getStat(TransactionType.INCOME)?.total ?? 0,
      totalExpense: getStat(TransactionType.EXPENSE)?.total ?? 0,
      totalTransfers: getStat(TransactionType.TRANSFER)?.total ?? 0,
      transactionCounts: {
        income: getStat(TransactionType.INCOME)?.count ?? 0,
        expense: getStat(TransactionType.EXPENSE)?.count ?? 0,
        transfer: getStat(TransactionType.TRANSFER)?.count ?? 0,
      },
    };
  }
}
