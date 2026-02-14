import { Module } from '@nestjs/common';
import { AssignmentsService } from './asignaciones.service';
import { AsignacionesController } from './asignaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './entities/asignacione.entity';
import { UnassignedBoxesService } from '../caja-sin-asignar/caja-sin-asignar.service';
import { UnassignedBox } from '../caja-sin-asignar/entities/caja-sin-asignar.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment, UnassignedBox])
  ],
  controllers: [AsignacionesController],
  providers: [AssignmentsService, UnassignedBoxesService],
})
export class AsignacionesModule {}
