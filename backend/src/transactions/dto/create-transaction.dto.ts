import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsMongoId,
  ValidateIf,
  IsDate,
} from 'class-validator';
import { TransactionType } from '../schemas/transaction.schema';

export class CreateTransactionDto {
  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsMongoId()
  sourceId: string;

  // Куди (Обов'язкове ТІЛЬКИ якщо тип = TRANSFER)
  @ValidateIf((o) => o.type === TransactionType.TRANSFER)
  @IsNotEmpty({ message: 'Destination source is required for transfers' })
  @IsMongoId()
  destinationSourceId?: string;

  @IsNumber()
  @IsOptional()
  fee?: number;
}
