import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { AccountsService } from './cuentas.service';
import { CreateAccountDto } from './dto/create-cuenta.dto';
import { UpdateAccountDto } from './dto/update-cuenta.dto';
import { AuthGuard } from '@nestjs/passport';
import { UnassignedBoxesService } from '../caja-sin-asignar/caja-sin-asignar.service';
import { ExchangeRatesService } from '../tasas-de-cambio/tasas-de-cambio.service';
import Big from 'big.js';
import type { RequestDto } from '../auth/jwt.strategy';
import { ConvertedBalance, TotalByCurrenciesData } from 'src/types/accounts.type';

@UseGuards(AuthGuard('jwt'))
@UsePipes(new ValidationPipe())
@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly unassignedBoxesService: UnassignedBoxesService,
    private readonly exchangeRatesService: ExchangeRatesService
  ) {}

  @Get('summary')
  async getSummary(@Request() req: RequestDto) {
    const user = req.user;
    
    const totalByCurrencies = await this.accountsService.getTotalByCurrency(user.sub);
    
    const rates = await this.exchangeRatesService.getRates();

    const groupedRates = rates.reduce((acc, item) => {
      const key = item.currencyId;
      acc[key] = item.rate;

      return acc;
    }, {});

    console.log(rates);
    const balanceSummarys = totalByCurrencies.map((total) => {
      
      const convertedBalance = rates.reduce((acc, rate) => {
        if (rate.currencyId !== total.currencyId) {
          const convertion = this.exchangeRatesService.conversionsRates(groupedRates[total.currencyId], rate.rate, total.balance);
  
          acc.push({
            currencyId: rate.currencyId,
            amount: convertion
          });
        }

        return acc;
        
      }, [] as ConvertedBalance[]);

      return {
        ...total,
        convertedBalance: convertedBalance
      };
    });

    return balanceSummarys;
  }

  @Get('')
  async getAccounts(@Request() req: RequestDto) {
    const userId = req.user.sub;

    const accounts = await this.accountsService.getAccounts(userId);

    const totalByCurrencies = await this.accountsService.getTotalByCurrency(userId);

    const groupedTotalByCurrencies = totalByCurrencies.reduce((acc, item) => {
      const key = item.currencyId;

      acc[key] = item.balance;

      return acc;
    }, {});

    return { accounts, totalByCurrencies: groupedTotalByCurrencies };
  }

  @Post()
  async createAccount(@Body() createAccountDto: CreateAccountDto, @Request() req: RequestDto) {
    const userId = req.user.sub;

    const newAccount = await this.accountsService.create(createAccountDto, userId);
    return newAccount;
  }

  @Get('byCurrency')
  async geTotalByCurrency(@Request() req: RequestDto) {
    const userId = req.user.sub;
    const totalByCurrencies = await this.accountsService.getTotalByCurrency(userId);

    return totalByCurrencies;
  }

  @Delete(':id')
  async deleteAccount(@Param() accountId: string) {
    console.log(accountId);
    const accountDeleted = await this.accountsService.deleteAccount(accountId);
    return accountDeleted;
  }
}
