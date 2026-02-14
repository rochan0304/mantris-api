import { PartialType } from '@nestjs/mapped-types';
import { CreateAssignmentDto } from './create-asignacione.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateAssignmentDto extends PartialType(CreateAssignmentDto) {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    amount: number;
}
