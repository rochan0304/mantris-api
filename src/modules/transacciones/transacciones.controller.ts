import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransactionsService } from './transacciones.service';
import { CreateTransactionDto } from './dto/create-transaccione.dto';
import { UpdateTransactionDto } from './dto/update-transaccione.dto';
import type { RequestDto } from '../auth/jwt.strategy';
import { AuthGuard } from '@nestjs/passport';
import { TransferAccountDto } from './dto/transfer-account.dto';
import { TransferAssignmentDto } from './dto/transfer-assignment.dto';

@UseGuards(AuthGuard('jwt'))
@UsePipes(new ValidationPipe())
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('income')
  async createIncome(@Body() createTransactionDto: CreateTransactionDto, @Request() req: RequestDto) {
    const userId = req.user.sub;
    const baseCurrencyId = req.user.baseCurrency.id;
    
    const newIncome = await this.transactionsService.createIncome(createTransactionDto, userId, baseCurrencyId);
    return newIncome;
  }

  @Post('spent')
  async createSpent(@Body() createTransactionDto: CreateTransactionDto, @Request() req: RequestDto) { 
    const userId = req.user.sub;
    const baseCurrencyId = req.user.baseCurrency.id;

    const newSpent = await this.transactionsService.createSpent(createTransactionDto, userId, baseCurrencyId);

    return newSpent;
  }

  @Post('transfer/accounts')
  async transferAccount(@Body() transferAccountDto: TransferAccountDto, @Request() req: RequestDto) {
    const userId = req.user.sub;
    const baseCurrencyId = req.user.baseCurrency.id;

    const newTransferAccount = await this.transactionsService.createTransferAccount(transferAccountDto, userId, baseCurrencyId);

    return newTransferAccount;
  }

  @Patch('transfer/assignments')
  async transferAssignment(@Body() transferAssignment: TransferAssignmentDto, @Request() req: RequestDto) {
    const userId = req.user.sub;

    const newTransferAssignment = await this.transactionsService.createTransferAssignment(transferAssignment, userId);

    return newTransferAssignment;
  }
}