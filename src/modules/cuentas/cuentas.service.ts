import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-cuenta.dto';
import { UpdateAccountDto } from './dto/update-cuenta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/cuenta.entity';
import { Repository } from 'typeorm';
import Big from 'big.js';
import { TotalByCurrenciesData } from 'src/types/accounts.type';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>
    ){}

    async create(createAccountDto: CreateAccountDto, userId: string) {
        const newAccount = this.accountRepository.create({
            ...createAccountDto,
            currency: { id: createAccountDto.currencyId },
            user: { id: userId },
        });

        return await this.accountRepository.save(newAccount);
    }

    async balanceTotal(userId: string) {
        const totalByAccounts = await this.getTotalByCurrency(userId);

        const result = await this.accountRepository
        .createQueryBuilder('account')
        .select('SUM(account.currentBalance)', 'total')
        .where('account.userId = :userId', { userId })
        .getRawOne();

        return parseFloat(result.total);
    }

    async getTotalByCurrency(userId: string): Promise<TotalByCurrenciesData[]> {
        const result = await this.accountRepository
        .createQueryBuilder('account')
        .leftJoin('account.currency', 'c')
        .select('c.id', 'currencyId')
        .addSelect('c.symbol', 'currencySymbol')
        .addSelect('SUM(account.currentBalance)', 'balance')
        .where('account.userId = :userId', { userId })
        .groupBy('c.id')
        .getRawMany();

        return result;
    }

    async getAccounts(userId: string) {
        const accounts = await this.accountRepository.createQueryBuilder('account')
        .select(['account.id AS id', 'account.name AS name', 'account.currentBalance AS balance', 'account.currencyId AS currency'])
        .where('account.userId = :userId', { userId })
        .orderBy('balance', 'DESC')
        .getRawMany();
        
        return accounts;
    }
}
