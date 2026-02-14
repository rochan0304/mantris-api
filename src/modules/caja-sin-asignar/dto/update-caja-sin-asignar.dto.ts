import { PartialType } from '@nestjs/mapped-types';
import { CreateUnassignedBoxDto } from './create-caja-sin-asignar.dto';

export class UpdateUnassignedBoxDto extends PartialType(CreateUnassignedBoxDto) {}
