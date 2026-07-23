import { IsIn, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(30, { message: "Назва категорії не може перевищувати 30 символів" })
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(["income", "expense"], { message: "Тип категорії може бути тільки income або expense" })
    type: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(["teal", "green", "yellow", "red", "blue", "purple", "gray"])
    color: string;
}