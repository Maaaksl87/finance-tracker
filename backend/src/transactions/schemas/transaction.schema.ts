import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Source } from '../../sources/schemas/source.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ default: 0 })
  fee: number;

  @Prop({ default: 'UAH' })
  currency: string;

  @Prop()
  exchangeRate?: number;

  @Prop()
  receiptUrl?: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: Source.name })
  destinationSourceId?: Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: Source.name, required: true })
  sourceId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ default: false })
  excludeFromStats: boolean;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SavingPlan', required: false })
  savingPlanId?: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Compound index for efficient per-user transaction queries sorted by date
TransactionSchema.index({ userId: 1, date: -1 });
// Index for filtering by type within a user's transactions
TransactionSchema.index({ userId: 1, type: 1 });
// Index for filtering by source within a user's transactions
TransactionSchema.index({ userId: 1, sourceId: 1 });
