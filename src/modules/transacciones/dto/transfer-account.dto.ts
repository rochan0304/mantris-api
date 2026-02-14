import { IsNotEmpty, IsOptional, Min } from "class-validator";

export class TransferAccountDto {
    @IsNotEmpty()
    @Min(0.01)
    originAmount: number;
    
    @IsNotEmpty()
    @Min(0.01)
    destinationAmount: number;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    originCurrencyId: string;

    @IsNotEmpty()
    destinationCurrencyId: string;

    @IsNotEmpty({ message: 'Debes seleccionar una cuenta.'})
    originAccountId: string;

    @IsNotEmpty({ message: 'Debes seleccionar una cuenta.'})
    destinationAccountId: string;
}