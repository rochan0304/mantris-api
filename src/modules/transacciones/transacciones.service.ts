import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaccione.dto';
import { UpdateTransactionDto } from './dto/update-transaccione.dto';
import { Transaction } from './entities/transaccione.entity';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRatesService } from '../tasas-de-cambio/tasas-de-cambio.service';
import { DataSource } from 'typeorm';
import { Account } from '../cuentas/entities/cuenta.entity';
import { ExchangeRate } from '../tasas-de-cambio/entities/tasas-de-cambio.entity';
import Big from 'big.js';
import { Assignment } from '../asignaciones/entities/asignacione.entity';
import { UnassignedBox } from '../caja-sin-asignar/entities/caja-sin-asignar.entity';
import { TransferAccountDto } from './dto/transfer-account.dto';
import { TransferAssignmentDto } from './dto/transfer-assignment.dto';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
        @InjectRepository(Account)
        private readonly accountsRepository: Repository<Account>,
        private readonly exchangeRatesService: ExchangeRatesService,
        private readonly dataSource: DataSource,
    ){}

    async createIncome(
        createTransactionDto: CreateTransactionDto, 
        userId: string,
        baseCurrencyId: string,
        externalManager?: EntityManager
    ) {
        let manager: EntityManager;

        let queryRunnner: QueryRunner | null = null;

        if (externalManager) {
            manager = externalManager;
        } else {
            queryRunnner = this.dataSource.createQueryRunner();
            await queryRunnner.connect();
            await queryRunnner.startTransaction();
            manager = queryRunnner.manager;
        }
        
        try {
            const currencyId = createTransactionDto.currencyId;

            const account = await manager.findOne(Account, { 
                where: {id: createTransactionDto.accountId } 
            });
            
            if (!account) {
                throw new BadRequestException('La cuenta no existe');
            }

            
            
            const rateResult = await manager.createQueryBuilder(ExchangeRate, 'rate')
            .distinctOn(['rate.originCurrencyId'])
            .select('rate.id', 'rateId')
            .where('rate.originCurrencyId = :currencyId', { currencyId })
            .orderBy('rate.originCurrencyId')
            .addOrderBy('rate.creationDate', 'DESC')
            .getRawOne();
            
            const rateId = rateResult.rateId;
            
            const transactionData: any = {
                amount: createTransactionDto.amount,
                type: createTransactionDto.type,
                user: { id: userId },
                account: account,
                currency: { id: createTransactionDto.currencyId }
            };
            
            if (rateId) {
                transactionData.rate = { id: rateId };
            }

            const newTransaction = manager.create(Transaction, transactionData);
            await manager.save(newTransaction);
            
            const updatedBalance = new Big(account.currentBalance);
            account.currentBalance = Number((updatedBalance.plus(createTransactionDto.amount)));
            
            if (!externalManager) {
                const unassignedBox = await manager.findOne(UnassignedBox, { 
                    where: { user: { id: userId } }
                });

                if (!unassignedBox) {
                    throw new BadRequestException('No se encontró la caja sin asignar.');
                }

                const updatedUnassignedBox = new Big(unassignedBox.availableAmount);
                const amountConverted = await this.exchangeRatesService.conversionsCurrencys(createTransactionDto.currencyId, baseCurrencyId, String(createTransactionDto.amount));
                unassignedBox.availableAmount = Number(updatedUnassignedBox.plus(amountConverted));
                await manager.save(unassignedBox);
            }
            
            await manager.save(account);
            
            if (queryRunnner) {
                await queryRunnner.commitTransaction();
            }

            return { 
                message: 'Ingreso registrado con éxito.', 
                newBalance: account.currentBalance 
            };
            
        } catch (error) {
            if (queryRunnner) {
                await queryRunnner.rollbackTransaction();
            }
            throw error;
        } finally {
            if (queryRunnner) {
                await queryRunnner.release();
            }
        }
    }
    
    async createSpent(
        dto: CreateTransactionDto, 
        userId: string,
        baseCurrencyId: string,
        externalManager?: EntityManager
    ) {
        let manager: EntityManager;
        let queryRunner: QueryRunner | null = null;
        
        if (externalManager) {
            manager = externalManager;
        } else {
            queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            manager = queryRunner.manager;
        }
        
        try {
            const account = await manager.findOne(Account, { where: { id: dto.accountId }});
            
            if (!account) {
                throw new BadRequestException('No se encontró esta cuenta.');
            }
            
            if (account.currentBalance < dto.amount ) {
                throw new BadRequestException('No hay suficientes fondos en la cuenta.');
            }
            
            
            const rateResult = await manager.createQueryBuilder(ExchangeRate, 'rate')
            .distinctOn(['rate.originCurrencyId'])
            .select('rate.id', 'rateId')
            .where('rate.originCurrencyId = :currencyId', { currencyId: dto.currencyId })
            .orderBy('rate.originCurrencyId')
            .addOrderBy('rate.creationDate', 'DESC')
            .getRawOne();
            
            const transactionData: any = {
                amount: dto.amount,
                type: dto.type,
                user: { id: userId },
                currency: { id: dto.currencyId },
                account: account,
                rate: { id: rateResult.rateId }
            };
            if (dto.assignmentId) {
                const assignment = await manager.findOne(Assignment, { where: { id: dto.assignmentId }});
                
                if (!assignment) {
                    throw new BadRequestException('No se encontró esta asignación.');
                }
                
                transactionData.assignment = assignment;
                
                const updateAssignment = new Big(assignment.availableBalance);
                
                const amountConverted = await this.exchangeRatesService.conversionsCurrencys(dto.currencyId, '', String(dto.amount));
                
                assignment.availableBalance = Number(updateAssignment.minus(amountConverted));
                await manager.save(assignment);
            }
            
            const newSpent = manager.create(Transaction, transactionData);
            await manager.save(newSpent);
            
            const updatedAccount = new Big(account.currentBalance);
            account.currentBalance = Number(updatedAccount.minus(dto.amount));
            await manager.save(account);

            if (queryRunner) {
                await queryRunner.commitTransaction();
            }

            return newSpent;
            
        } catch (error) {
            if (queryRunner) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        } finally {
            if (queryRunner) {
                await queryRunner.release();
            }
        }
    }

    async createTransferAccount(dto: TransferAccountDto, userId: string, baseCurrencyId: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        queryRunner.connect();
        queryRunner.startTransaction();

        try {
            const originAccountData: CreateTransactionDto = {
                amount: dto.originAmount,
                accountId: dto.originAccountId,
                currencyId: dto.originCurrencyId,
                type: 'GASTO',
            };

            const destinationAccountData: CreateTransactionDto = {
                amount: dto.destinationAmount,
                accountId: dto.destinationAccountId,
                currencyId: dto.destinationCurrencyId,
                type: 'INGRESO',
            };
            
            const newSpent = await this.createSpent(originAccountData, userId, baseCurrencyId, queryRunner.manager);

            const newIncome = await this.createIncome(destinationAccountData, userId, baseCurrencyId, queryRunner.manager);

            await queryRunner.commitTransaction();
            console.log('AQUUUUUUUIIIIIIIIIIIII')
            return { newSpent, newIncome };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async createTransferAssignment(dto: TransferAssignmentDto, userId: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const originAssignment = await queryRunner.manager.findOneBy(Assignment, { id: dto.originAssignmentId });
            if (!originAssignment) {
                throw new BadRequestException('No se encontró la cuenta de origen.');
            }
            if (originAssignment.availableBalance < dto.amount) {
                throw new BadRequestException('Saldo insuficiente en la asignacion de origen.');
            }

            const destinationAssignment = await queryRunner.manager.findOneBy(Assignment, { id: dto.destinationAssignmentId });
            if (!destinationAssignment) {
                throw new BadRequestException('No se encontró la cuenta de destino.');
            }

            const amountToUpdate = new Big(0);
            originAssignment.availableBalance = Number(amountToUpdate.plus(originAssignment.availableBalance).minus(dto.amount).toFixed(2));
            destinationAssignment.availableBalance = Number(amountToUpdate.plus(destinationAssignment.availableBalance).plus(dto.amount).toFixed(2));

            await queryRunner.manager.save([originAssignment, destinationAssignment]);
            await queryRunner.commitTransaction();
            return { message: 'Transferencia exitosa!'};
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
