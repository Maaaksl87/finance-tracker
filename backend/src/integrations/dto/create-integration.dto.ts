import { IsString, IsNotEmpty } from 'class-validator';

export class CreateIntegrationDto {
    @IsString()
    @IsNotEmpty()
    apiKey: string;

    @IsString()
    @IsNotEmpty()
    apiSecret: string;

    @IsString()
    @IsNotEmpty()
    exchange: string;
}
