import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavingPlansService } from './saving-plans.service';
import { SavingPlansController } from './saving-plans.controller';
import { SavingPlan, SavingPlanSchema } from './schemas/saving-plan.schema';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavingPlan.name, schema: SavingPlanSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [SavingPlansController],
  providers: [SavingPlansService],
  exports: [SavingPlansService],
})
export class SavingPlansModule {}
