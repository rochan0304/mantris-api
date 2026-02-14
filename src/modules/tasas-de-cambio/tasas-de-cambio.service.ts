import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateExchangeRateDto } from './dto/create-tasas-de-cambio.dto';
import { UpdateExchangeRateDto } from './dto/update-tasas-de-cambio.dto';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from './entities/tasas-de-cambio.entity';
import { Repository } from 'typeorm';
import Big from 'big.js';
import { GetExchangeRateDto } from 'src/types/exhangeRates.type';

interface ExchangeRateApi {
    result: string;
	documentation: string;
	terms_of_use: string;
	time_last_update_unix: number;
	time_last_update_utc: string
	time_next_update_unix: number;
	time_next_update_utc: string
	base_code: string;
	target_code: string;
	conversion_rate: number;
}

@Injectable()
export class ExchangeRatesService implements OnModuleInit {
    constructor(
        @InjectRepository(ExchangeRate)
        private readonly exchangeRatesRepository: Repository<ExchangeRate>
    ){}

    async onModuleInit() {
        const count = await this.exchangeRatesRepository.count();

        if (count > 0) {
            console.log('⚠️ Currencies already exist, skipping seed.');
            return;
        }

        await this.create();
        console.log('✅ Exchange Rates seeded successfully')
    }

    @Cron('0 0 0,12 * * *', { timeZone: 'America/Caracas' })
    async create() {
        try {
            let response = await fetch('https://v6.exchangerate-api.com/v6/725ad52e92e4f8b755af6c94/pair/EUR/GBP');

            // if (response.status !== 200) throw new Error('Error al obtener la tasa EUR');

            const VES_to_EUR = await response.json();

            response = await fetch('https://ve.dolarapi.com/v1/dolares');
            
            const VES_to_USD_USDT = await response.json();
            
            const VES_to_USD = VES_to_USD_USDT[0];
            const VES_to_USDT = VES_to_USD_USDT[1];

            const rates = [
                { rate: VES_to_USD.promedio, baseCurrency: { id: 'VES' }, originCurrency: { id: 'BCV'} },
                { rate: VES_to_USDT.promedio, baseCurrency: { id: 'VES' }, originCurrency: { id: 'USDT'} },
                { rate: new Big(VES_to_USD.promedio).div(VES_to_EUR.conversion_rate).toFixed(2), baseCurrency: { id: 'VES' }, originCurrency: { id: 'EUR'} },
            ];

            return this.exchangeRatesRepository.insert(rates);

        } catch (error) {
            console.log(error);
        }
    }

    async getRates(): Promise<GetExchangeRateDto[]> {
        const rates = await this.exchangeRatesRepository
        .createQueryBuilder('rate')
        .distinctOn(['rate.originCurrencyId'])
        .select('rate.originCurrencyId', 'currencyId')
        .addSelect('rate.rate', 'rate')
        .orderBy('rate.originCurrencyId', 'DESC')
        .addOrderBy('rate.creationDate', 'DESC')
        .getRawMany();
        
        return [
            ...rates,
        ];
    }

    async conversionsCurrencys(origin: string, destination: string, amount: string) {
        const rates = await this.exchangeRatesRepository
        .createQueryBuilder('rate')
        .distinctOn(['rate.originCurrencyId'])
        .select('rate.originCurrencyId', 'currencyId')
        .addSelect('rate.rate', 'rate')
        .where('rate.originCurrencyId IN (:...ids)', { ids: [origin, destination] })
        .orderBy('rate.originCurrencyId')
        .addOrderBy('rate.creationDate', 'DESC')
        .getRawMany();

        if (!rates) {
            throw new NotFoundException('No se encontro la tasa');
        }

        let originRate = '';
        let destinationRate = '';

        rates.forEach((rate) => {
            if (rate.currencyId === origin) originRate = rate.rate;
            if (rate.currencyId === destination) destinationRate = rate.rate;
        });

        const result = new Big(amount).times(originRate).div(destinationRate).toFixed(2);

        return result;
    }

    conversionsRates(origin: string, destination: string, amount: string) {
        const result = new Big(amount).times(origin).div(destination).toFixed(2);

        return result;
    }

    async getLatestExchangeRate (currencyId: string) {
        const rateId = await this.exchangeRatesRepository.createQueryBuilder('rate')
        .distinctOn(['rate.originCurrencyId'])
        .select('rate.id', 'rateId')
        .where('rate.originCurrencyId = :currencyId', { currencyId })
        .orderBy('rate.originCurrencyId')
        .addOrderBy('rate.creationDate', 'DESC')
        .getRawOne();

        return rateId;
    }
}
