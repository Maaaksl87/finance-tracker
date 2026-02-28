import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
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
  @MaxLength(15, { message: 'Категорія не може перевищувати 15 символів' })
  category: string;

  @IsString()
  @IsOptional()
  @MaxLength(150, { message: 'Опис не може перевищувати 150 символів' })
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsMongoId()
  sourceId: string;

  // Куди (Обов'язкове ТІЛЬКИ якщо тип = TRANSFER)
  @ValidateIf((o: CreateTransactionDto) => o.type === TransactionType.TRANSFER)
  @IsNotEmpty({ message: 'Потрібно вказати джерело при переказі коштів' })
  @IsMongoId()
  destinationSourceId?: string;

  @IsNumber()
  @IsOptional()
  fee?: number;
}
