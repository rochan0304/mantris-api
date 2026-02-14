import { PartialType } from '@nestjs/mapped-types';
import { CreateCurrencyDto } from './create-moneda.dto';

export class UpdateCurrencyDto extends PartialType(CreateCurrencyDto) {}
