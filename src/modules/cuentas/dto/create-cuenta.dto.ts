import { IsNotEmpty, IsOptional, Min } from "class-validator";

export class CreateAccountDto {
    @IsNotEmpty()
    name: string;

    @Min(0)
    currentBalance: number;

    @IsNotEmpty()
    currencyId: string;
}
