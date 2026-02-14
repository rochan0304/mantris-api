import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-usuario.dto';
import { IsOptional } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUserDto) {
    @IsOptional()
    currencyId: number;

    @IsOptional()
    boxId: number;
}
