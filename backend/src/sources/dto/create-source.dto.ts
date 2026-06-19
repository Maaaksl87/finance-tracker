import { IsIn, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator";

export class CreateSourceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: "Назва джерела не може перевищувати 20 символів" })
  name: string;

  @IsNumber()
  @Min(0, { message: "Баланс має бути не менше 0" })
  balance: number;

  @IsString()
  @IsNotEmpty()
  type: "cash" | "card" | "crypto" | "deposit";

  @IsIn(["UAH", "USD", "EUR"], { message: "Ця валюта ще не додана" })
  currency: string;

  @IsIn(["teal", "green", "yellow", "red", "blue", "purple", "gray"], {
    message: "Цей колір ще не доданий",
  })
  color: "teal" | "green" | "yellow" | "red" | "blue" | "purple" | "gray";
}
