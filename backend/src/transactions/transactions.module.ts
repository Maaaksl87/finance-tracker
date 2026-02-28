import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

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
  ],
})
export class TransactionsModule {}
