import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateBudgetDto {
  @IsString({ message: "Категорія повинна бути рядком" })
  @IsNotEmpty({ message: "Категорія обов'язкова" })
  category: string;

  @IsNumber({}, { message: "Ліміт повинен бути числом" })
  @IsPositive({ message: "Ліміт повинен бути більше нуля" })
  limit: number;

  @IsString({ message: "Валюта повинна бути рядком" })
  @IsOptional()
  currency?: string;
}
