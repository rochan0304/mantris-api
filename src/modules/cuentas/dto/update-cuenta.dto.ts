import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-cuenta.dto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}
