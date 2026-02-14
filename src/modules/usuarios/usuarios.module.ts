import { Module } from '@nestjs/common';
import { UsersService } from './usuarios.service';
import { UsersController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/usuario.entity';
import { AccountsService } from '../cuentas/cuentas.service';
import { Account } from '../cuentas/entities/cuenta.entity';
import { UnassignedBoxesService } from '../caja-sin-asignar/caja-sin-asignar.service';
import { UnassignedBox } from '../caja-sin-asignar/entities/caja-sin-asignar.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([User])
    ],
  controllers: [UsersController],
  providers: [
    UsersService,
  ],
})
export class UsuariosModule {}
