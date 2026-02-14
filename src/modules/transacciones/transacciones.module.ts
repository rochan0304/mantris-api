import { Module } from '@nestjs/common';
import { TransactionsService } from './transacciones.service';
import { TransactionsController } from './transacciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaccione.entity';
import { ExchangeRatesService } from '../tasas-de-cambio/tasas-de-cambio.service';
import { ExchangeRate } from '../tasas-de-cambio/entities/tasas-de-cambio.entity';
import { AccountsService } from '../cuentas/cuentas.service';
import { Account } from '../cuentas/entities/cuenta.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Transaction, ExchangeRate, Account])
    ],
  controllers: [TransactionsController],
  providers: [TransactionsService, ExchangeRatesService, AccountsService],
})
export class TransaccionesModule {}
