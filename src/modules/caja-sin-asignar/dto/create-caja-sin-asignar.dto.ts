import { IsNotEmpty } from "class-validator";

export class CreateUnassignedBoxDto {
    @IsNotEmpty()
    userId: string;
}
