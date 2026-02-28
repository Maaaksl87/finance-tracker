import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CreateSourceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: 'Назва джерела не може перевищувати 20 символів' })
  name: string;

  @IsNumber()
  @Min(0, { message: 'Баланс має бути не менше 0' })
  balance: number;
}
