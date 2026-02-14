import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaccione.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
