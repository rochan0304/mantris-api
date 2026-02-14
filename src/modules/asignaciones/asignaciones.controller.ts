import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { AssignmentsService } from './asignaciones.service';
import { CreateAssignmentDto } from './dto/create-asignacione.dto';
import { UpdateAssignmentDto } from './dto/update-asignacione.dto';
import { AuthGuard } from '@nestjs/passport';
import type { RequestDto } from '../auth/jwt.strategy';
import { UnassignedBoxesService } from '../caja-sin-asignar/caja-sin-asignar.service';

@UseGuards(AuthGuard('jwt'))
@UsePipes(new ValidationPipe())
@Controller('assignments')
export class AsignacionesController {
  constructor(
    private readonly assignmentsService: AssignmentsService,
    private readonly unassignedBoxesService: UnassignedBoxesService
  ) {}

  @Post()
  async create(@Body() createAssignmentDto: CreateAssignmentDto, @Request() req: RequestDto) {
    const userId = req.user.sub;
    const newAssignment = await this.assignmentsService.create(createAssignmentDto, userId);
    return newAssignment;
  }

  @Get()
  async getAssignments(@Request() req: RequestDto) {
    const userId = req.user.sub;
    
    const assignments = await this.assignmentsService.getAssignments(userId);

    return assignments;
  }

  @Patch('income')
  async addAssignment (@Body() incomeAssignmentDto: UpdateAssignmentDto, @Request() req: RequestDto) {
    const userId = req.user.sub;
    const addedAssignment = await this.assignmentsService.addAssignment(incomeAssignmentDto, userId);
    return addedAssignment;
  }
}
