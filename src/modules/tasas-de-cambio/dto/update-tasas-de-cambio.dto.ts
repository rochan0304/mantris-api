import { PartialType } from '@nestjs/mapped-types';
import { CreateExchangeRateDto } from './create-tasas-de-cambio.dto';

export class UpdateExchangeRateDto extends PartialType(CreateExchangeRateDto) {}
