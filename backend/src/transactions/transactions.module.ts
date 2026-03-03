import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SavingPlansModule } from 'src/saving-plans/saving-palns.module';

import { SourcesModule } from '../sources/sources.module';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    SourcesModule,
    SavingPlansModule,
  ],
})
export class TransactionsModule {}
