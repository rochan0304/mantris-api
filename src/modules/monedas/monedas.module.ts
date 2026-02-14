import { Module } from '@nestjs/common';
import { CurrenciesService } from './monedas.service';
import { CurrenciesController } from './monedas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './entities/moneda.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Currency])
  ],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
})
export class MonedasModule {}
