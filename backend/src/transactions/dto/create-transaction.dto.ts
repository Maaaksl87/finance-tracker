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
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '../schemas/transaction.schema';

export class CreateTransactionDto {
  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsMongoId()
  sourceId: string;

  // Куди (Обов'язкове ТІЛЬКИ якщо тип = TRANSFER)
  @ValidateIf((o: CreateTransactionDto) => o.type === TransactionType.TRANSFER)
  @IsNotEmpty({ message: 'Destination source is required for transfers' })
  @IsMongoId()
  destinationSourceId?: string;

  @IsNumber()
  @IsOptional()
  fee?: number;
}
