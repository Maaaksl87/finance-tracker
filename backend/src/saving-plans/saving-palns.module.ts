import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { SourcesModule } from "../sources/sources.module";
import {
  Transaction,
  TransactionSchema,
} from "../transactions/schemas/transaction.schema";
import { SavingPlansController } from "./saving-plans.controller";
import { SavingPlansService } from "./saving-plans.service";
import { SavingPlan, SavingPlanSchema } from "./schemas/saving-plan.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavingPlan.name, schema: SavingPlanSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    SourcesModule,
  ],
  controllers: [SavingPlansController],
  providers: [SavingPlansService],
  exports: [SavingPlansService],
})
export class SavingPlansModule {}
