import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

import { SavingPlanStatus } from '../schemas/saving-plan.schema';
import { CreateSavingPlanDto } from './create-saving-plan.dto';

export class UpdateSavingPlanDto extends PartialType(CreateSavingPlanDto) {
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentAmount?: number;

  @IsOptional()
  @IsEnum(SavingPlanStatus)
  status?: SavingPlanStatus;
}
