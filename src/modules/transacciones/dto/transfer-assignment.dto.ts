import { IsNotEmpty, IsOptional, Min } from "class-validator";

export class TransferAssignmentDto {
    @IsNotEmpty()
    @Min(0.01)
    amount: number;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty({ message: 'Debes seleccionar una cuenta.'})
    originAssignmentId: string;

    @IsNotEmpty({ message: 'Debes seleccionar una cuenta.'})
    destinationAssignmentId: string;
}