import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Transaction, TransactionType } from "../transactions/schemas/transaction.schema";
import { CreateBudgetDto } from "./dto/create-budget.dto";
import { UpdateBudgetDto } from "./dto/update-budget.dto";
import { BudgetAlertStatus, BudgetStatusResult } from "./interfaces/budget-status.interface";
import { Budget, BudgetDocument } from "./schemas/budget.schema";

@Injectable()
export class BudgetsService {
  constructor(
    @InjectModel(Budget.name) private readonly budgetModel: Model<BudgetDocument>,
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
  ) {}

  async create(createBudgetDto: CreateBudgetDto, userId: string): Promise<Budget> {
    const category = createBudgetDto.category.trim();

    const duplicate = await this.budgetModel
      .findOne({ userId: new Types.ObjectId(userId), category })
      .exec();

    if (duplicate) {
      throw new ConflictException("Бюджет для цієї категорії вже створено");
    }

    try {
      const budget = new this.budgetModel({
        ...createBudgetDto,
        category,
        userId: new Types.ObjectId(userId),
      });
      return await budget.save();
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException("Бюджет для цієї категорії вже створено");
      }
      throw error;
    }
  }

  async findAll(userId: string): Promise<Budget[]> {
    return this.budgetModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ category: 1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Budget> {
    const budget = await this.budgetModel
      .findOne({ _id: id, userId: new Types.ObjectId(userId) })
      .exec();

    if (!budget) {
      throw new NotFoundException("Бюджет не знайдено");
    }

    return budget;
  }

  async update(id: string, updateBudgetDto: UpdateBudgetDto, userId: string): Promise<Budget> {
    const budget = await this.budgetModel
      .findOneAndUpdate(
        { _id: id, userId: new Types.ObjectId(userId) },
        updateBudgetDto,
        { new: true },
      )
      .exec();

    if (!budget) {
      throw new NotFoundException("Бюджет не знайдено");
    }

    return budget;
  }

  async remove(id: string, userId: string): Promise<Budget> {
    const budget = await this.budgetModel
      .findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) })
      .exec();

    if (!budget) {
      throw new NotFoundException("Бюджет не знайдено");
    }

    return budget;
  }

  async getStatus(userId: string, monthStr?: string): Promise<BudgetStatusResult[]> {
    let year: number;
    let month: number;

    if (monthStr) {
      if (!/^\d{4}-\d{2}$/.test(monthStr)) {
        throw new BadRequestException("Невірний формат місяця (очікується YYYY-MM)");
      }
      const [y, m] = monthStr.split("-").map(Number);
      year = y;
      month = m - 1;
    } else {
      const now = new Date();
      year = now.getFullYear();
      month = now.getMonth();
    }

    const from = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    const to = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

    const budgets = await this.findAll(userId);
    if (!budgets.length) {
      return [];
    }

    interface CategoryExpenseAgg {
      _id: string;
      total: number;
    }

    const expensesByCategory = await this.transactionModel.aggregate<CategoryExpenseAgg>([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          type: TransactionType.EXPENSE,
          date: { $gte: from, $lte: to },
          excludeFromStats: { $ne: true },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const expenseMap = new Map<string, number>();
    for (const exp of expensesByCategory) {
      expenseMap.set(exp._id, exp.total);
    }

    return budgets.map((b: any) => {
      const spent = expenseMap.get(b.category) || 0;
      const limit = b.limit;
      const remaining = Math.max(0, limit - spent);
      const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;

      let status: BudgetAlertStatus = "normal";
      if (percentage > 100) {
        status = "exceeded";
      } else if (percentage >= 80) {
        status = "warning";
      }

      return {
        _id: b._id.toString(),
        category: b.category,
        limit,
        currency: b.currency || "UAH",
        spent,
        remaining,
        percentage,
        status,
      };
    });
  }
}
