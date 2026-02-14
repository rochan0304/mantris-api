import { Module } from '@nestjs/common';
import { UnassignedBoxesService } from './caja-sin-asignar.service';
import { UnassignedBoxesController } from './caja-sin-asignar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnassignedBox } from './entities/caja-sin-asignar.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([UnassignedBox])
    ],
  controllers: [UnassignedBoxesController],
  providers: [UnassignedBoxesService],
})
export class CajaSinAsignarModule {}
