import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Transaction, TransactionSchema } from "../transactions/schemas/transaction.schema";
import { Source, SourceSchema } from "./schemas/source.schema";
import { SourcesController } from "./sources.controller";
import { SourcesService } from "./sources.service";

@Module({
  controllers: [SourcesController],
  providers: [SourcesService],
  imports: [
    MongooseModule.forFeature([
      { name: Source.name, schema: SourceSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  exports: [SourcesService],
})
export class SourcesModule {}
