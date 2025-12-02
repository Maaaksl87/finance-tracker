import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Source } from '../../sources/schemas/source.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

// Enum для типів - це good practice
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer', // Сюди входить і зняття готівки, і обмін
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: TransactionType })
  type: string;

  @Prop({ default: 0 })
  fee: number;

  @Prop({ default: 'UAH' })
  currency: string;

  @Prop()
  exchangeRate?: number; // Курс обміну валют

  @Prop()
  receiptUrl?: string; // URL для збереження чека чи іншого документа(майбутня реалізація)

  @Prop({ required: true })
  category: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: Source.name })
  destinationSourceId?: Types.ObjectId; // Куди (для трансферів)

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: Source.name, required: true })
  sourceId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ default: false })
  excludeFromStats: boolean; // щоб виключити транзакцію зі статистики

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
