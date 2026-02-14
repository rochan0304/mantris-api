import { Module } from '@nestjs/common';
import { AccountsService } from './cuentas.service';
import { AccountsController } from './cuentas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/cuenta.entity';
import { UnassignedBoxesService } from '../caja-sin-asignar/caja-sin-asignar.service';
import { UnassignedBox } from '../caja-sin-asignar/entities/caja-sin-asignar.entity';
import { ExchangeRate } from '../tasas-de-cambio/entities/tasas-de-cambio.entity';
import { ExchangeRatesService } from '../tasas-de-cambio/tasas-de-cambio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, UnassignedBox, ExchangeRate])
  ],
  controllers: [AccountsController],
  providers: [
    AccountsService, 
    UnassignedBoxesService,
    ExchangeRatesService
  ],
})
export class CuentasModule {}
