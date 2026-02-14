import { IsNotEmpty, IsOptional, Min } from "class-validator";

export class CreateAssignmentDto {
    @IsNotEmpty()
    name?: string;

    @Min(0.1)
    assignedAmount?: number;

    @IsNotEmpty()
    type?: string;
}
