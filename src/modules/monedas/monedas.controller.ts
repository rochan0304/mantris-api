import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CurrenciesService } from './monedas.service';
import { CreateCurrencyDto } from './dto/create-moneda.dto';
import { UpdateCurrencyDto } from './dto/update-moneda.dto';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  async getAll() {
    const currencies = await this.currenciesService.getAllCurrencies();

    const groupedCurrencies = currencies.reduce((acc, item) => {
      const key = item.id;

      acc[key] = item;

      return acc;
    }, {});

    return groupedCurrencies;
  }
}
