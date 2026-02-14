import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UnassignedBoxesService } from './caja-sin-asignar.service';
import { CreateUnassignedBoxDto } from './dto/create-caja-sin-asignar.dto';
import { UpdateUnassignedBoxDto } from './dto/update-caja-sin-asignar.dto';
import { AuthGuard } from '@nestjs/passport';
import type { RequestDto } from '../auth/jwt.strategy';

@UseGuards(AuthGuard('jwt'))
@Controller('unassigned-boxes')
export class UnassignedBoxesController {
  constructor(private readonly unassignedBoxesService: UnassignedBoxesService) {}

  @Get('amount')
  async getUnassignedAmount(@Request() req: RequestDto) {
    const userId = req.user.sub;

    const unassignedAmount = await this.unassignedBoxesService.getUnassignedAmount(userId);

    return {unassignedAmount};
  }

}
