import { IsNotEmpty, IsOptional, Min } from "class-validator";

export class CreateTransactionDto {
    @IsNotEmpty()
    @Min(0.01)
    amount: number;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    currencyId: string;

    @IsNotEmpty({ message: 'Debes seleccionar una cuenta.'})
    accountId: string;

    @IsOptional()
    assignmentId?: string;
}
