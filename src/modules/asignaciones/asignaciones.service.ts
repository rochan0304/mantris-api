import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-asignacione.dto';
import { UpdateAssignmentDto } from './dto/update-asignacione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/asignacione.entity';
import { DataSource, Repository } from 'typeorm';
import { UnassignedBox } from '../caja-sin-asignar/entities/caja-sin-asignar.entity';
import Big from 'big.js';

@Injectable()
export class AssignmentsService {
    constructor(
        @InjectRepository(Assignment)
        private readonly assignmentRepository: Repository<Assignment>,
        private readonly dataSource: DataSource,
    ) {}

  async create(createAssignmentDto: CreateAssignmentDto, userId: string) {
    const newAssignment = this.assignmentRepository.create({
        ...createAssignmentDto,
        user: { id: userId }
    });

    return await this.assignmentRepository.save(newAssignment);
  }

  async getAssignments(userId: string) {
    const assignments = await this.assignmentRepository.createQueryBuilder('assignment')
    .select('*')
    .where('assignment.userId = :userId', { userId })
    .orderBy('assignment.type')
    .getRawMany();

    return assignments;
  }

  async addAssignment(addAssignmentDto: UpdateAssignmentDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    const addedAssignment = this.assignmentRepository.create();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const unassignedBox = await queryRunner.manager.findOne(UnassignedBox, { where: { user: { id: userId} }});
      
      if (unassignedBox && addAssignmentDto.amount <= unassignedBox.availableAmount) {
        const init = new Big(0);
        const rest = init.plus(unassignedBox.availableAmount).minus(addAssignmentDto.amount).toFixed(2);

        const updatedUnassignedBox = queryRunner.manager.create(UnassignedBox, {
          id: unassignedBox.id,
          availableAmount: Number(rest),
        });
        await queryRunner.manager.save(updatedUnassignedBox);

        const assignment = await queryRunner.manager.findOne(Assignment, { 
          where: { id: addAssignmentDto.id }
        });

        if (!assignment) {
          throw new BadRequestException('No se consiguió la asignación.');
        }

        const add = init.plus(assignment.availableBalance).plus(addAssignmentDto.amount).toFixed(2); 

        const updatedAssignment = queryRunner.manager.create(Assignment, {
          id: addAssignmentDto.id,
          availableBalance: Number(add),
        });

        await queryRunner.manager.save(updatedAssignment);

        await queryRunner.commitTransaction();

        return {
          availableBalance: add,
          unassignedBox: rest
        };

      }

      throw new BadRequestException('El monto introducido es inválido.');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteAssignment(id: string) {
    const result = await this.assignmentRepository.delete(id);
    return result;
  }
}
