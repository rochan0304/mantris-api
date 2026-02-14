import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExchangeRatesService } from './tasas-de-cambio.service';
import { CreateExchangeRateDto } from './dto/create-tasas-de-cambio.dto';
import { UpdateExchangeRateDto } from './dto/update-tasas-de-cambio.dto';

@Controller('exchange-rates')
export class ExhangeRatesController {
  constructor(private readonly exchangeRatesService: ExchangeRatesService) {}

  @Post()
  async create() {
    const exchangeRates = await this.exchangeRatesService.create();
    return exchangeRates;
  }

  @Get()
  async getAllRates () {
    const rates = await this.exchangeRatesService.getRates();
    const groupedRates = rates.reduce((acc, item) => {
      const key = item.currencyId;
      acc[key] = +item.rate;
      return acc;

    }, {});

    return groupedRates;
  }

  @Get('convertion')
  async getConvertion() {
    const rates = await this.exchangeRatesService.conversionsRates('BCV', 'USDT', '14.55');
    return rates;
  }
}
