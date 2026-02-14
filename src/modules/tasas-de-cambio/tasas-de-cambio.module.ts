import { Module } from '@nestjs/common';
import { ExchangeRatesService } from './tasas-de-cambio.service';
import { ExhangeRatesController } from './tasas-de-cambio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRate } from './entities/tasas-de-cambio.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([ExchangeRate])
    ],
  controllers: [ExhangeRatesController],
  providers: [ExchangeRatesService],
})
export class TasasDeCambioModule {}
