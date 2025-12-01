import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateSourceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0, { message: 'Balance must be at least 0' })
  balance: number;
}
