import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  SavingPlan,
  SavingPlanDocument,
  SavingPlanStatus,
} from './schemas/saving-plan.schema';
import { CreateSavingPlanDto } from './dto/create-saving-plan.dto';
import { UpdateSavingPlanDto } from './dto/update-saving-plan.dto';
import {
  Transaction,
  TransactionDocument,
} from '../transactions/schemas/transaction.schema';

@Injectable()
export class SavingPlansService {
  constructor(
    @InjectModel(SavingPlan.name)
    private savingPlanModel: Model<SavingPlanDocument>,

    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(
    userId: string,
    createDto: CreateSavingPlanDto,
  ): Promise<SavingPlan> {
    const savingPlan = new this.savingPlanModel({
      ...createDto,
      userId: new Types.ObjectId(userId),
      currentAmount: 0,
      status: SavingPlanStatus.ACTIVE,
    });

    return savingPlan.save();
  }

  async findAll(userId: string): Promise<SavingPlan[]> {
    console.log('🔍 Finding plans for userId:', userId);

    const plans = await this.savingPlanModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();

    console.log('📦 Found plans:', plans.length);

    return plans;
  }

  async findOne(userId: string, id: string): Promise<SavingPlan> {
    const savingPlan = await this.savingPlanModel
      .findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!savingPlan) {
      throw new NotFoundException(`План заощаджень з ID ${id} не знайдено`);
    }

    return savingPlan;
  }

  async update(
    userId: string,
    id: string,
    updateDto: UpdateSavingPlanDto,
  ): Promise<SavingPlan> {
    const savingPlan = await this.savingPlanModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          userId: new Types.ObjectId(userId),
        },
        { $set: updateDto },
        { new: true },
      )
      .exec();

    if (!savingPlan) {
      throw new NotFoundException(`План заощаджень з ID ${id} не знайдено`);
    }

    // Автоматично позначаємо як завершений, якщо досягнуто цілі
    if (savingPlan.currentAmount >= savingPlan.targetAmount) {
      savingPlan.status = SavingPlanStatus.COMPLETED;
      await savingPlan.save();
    }

    return savingPlan;
  }

  async remove(userId: string, id: string): Promise<{ deleted: boolean }> {
    const result = await this.savingPlanModel
      .deleteOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`План заощаджень з ID ${id} не знайдено`);
    }

    return { deleted: true };
  }

  async addFunds(
    userId: string,
    id: string,
    amount: number,
  ): Promise<SavingPlan> {
    const savingPlan = await this.findOne(userId, id);

    if (savingPlan.status === SavingPlanStatus.COMPLETED) {
      throw new BadRequestException('Цей план заощаджень вже завершено');
    }

    if (savingPlan.status === SavingPlanStatus.PAUSED) {
      throw new BadRequestException('Цей план заощаджень призупинено');
    }

    const newAmount = savingPlan.currentAmount + amount;
    const isCompleted = newAmount >= savingPlan.targetAmount;

    return this.savingPlanModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            currentAmount: newAmount,
            status: isCompleted
              ? SavingPlanStatus.COMPLETED
              : SavingPlanStatus.ACTIVE,
          },
        },
        { new: true },
      )
      .orFail(() => new NotFoundException('План заощаджень не знайдено'))
      .exec();
  }

  async withdrawFunds(
    userId: string,
    id: string,
    amount: number,
  ): Promise<SavingPlan> {
    const savingPlan = await this.findOne(userId, id);

    if (amount > savingPlan.currentAmount) {
      throw new BadRequestException('Недостатньо коштів у плані заощаджень');
    }

    const newAmount = savingPlan.currentAmount - amount;

    return this.savingPlanModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            currentAmount: newAmount,
            status:
              savingPlan.status === SavingPlanStatus.COMPLETED
                ? SavingPlanStatus.ACTIVE
                : savingPlan.status,
          },
        },
        { new: true },
      )
      .orFail(() => new NotFoundException('План заощаджень не знайдено'))
      .exec();
  }

  async getStats(userId: string): Promise<{
    totalPlans: number;
    activePlans: number;
    completedPlans: number;
    totalSaved: number;
    totalTarget: number;
  }> {
    const plans = await this.findAll(userId);

    return {
      totalPlans: plans.length,
      activePlans: plans.filter((p) => p.status === SavingPlanStatus.ACTIVE)
        .length,
      completedPlans: plans.filter(
        (p) => p.status === SavingPlanStatus.COMPLETED,
      ).length,
      totalSaved: plans.reduce((sum, p) => sum + p.currentAmount, 0),
      totalTarget: plans.reduce((sum, p) => sum + p.targetAmount, 0),
    };
  }

  async getTransactions(userId: string, planId: string) {
    await this.findOne(userId, planId);

    return this.transactionModel
      .find({
        userId: new Types.ObjectId(userId),
        savingPlanId: new Types.ObjectId(planId),
      })
      .sort({ date: -1 })
      .limit(30)
      .populate('sourceId', 'name balance')
      .exec();
  }
}
