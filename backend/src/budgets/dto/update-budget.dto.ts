import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class UpdateBudgetDto {
  @IsNumber({}, { message: "Ліміт повинен бути числом" })
  @IsPositive({ message: "Ліміт повинен бути більше нуля" })
  @IsOptional()
  limit?: number;
}
