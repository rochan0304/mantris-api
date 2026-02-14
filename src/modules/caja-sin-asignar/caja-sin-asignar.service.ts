import { Injectable } from '@nestjs/common';
import { CreateUnassignedBoxDto } from './dto/create-caja-sin-asignar.dto';
import { UpdateUnassignedBoxDto } from './dto/update-caja-sin-asignar.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UnassignedBox } from './entities/caja-sin-asignar.entity';
import { Repository } from 'typeorm';
import Big from 'big.js';

@Injectable()
export class UnassignedBoxesService {
    constructor(
        @InjectRepository(UnassignedBox)
        private readonly unassignedRepository: Repository<UnassignedBox>
    ){}

    async create(createUnassignedBoxDto: CreateUnassignedBoxDto) {
        const newUnassignedBox = this.unassignedRepository.create({
            user: { id: createUnassignedBoxDto.userId }
        });

        return await this.unassignedRepository.save(newUnassignedBox);
    }

    async getUnassignedAmount(userId: string) {
        const result = await this.unassignedRepository
        .createQueryBuilder('unassigned')
        .select('unassigned.availableAmount', 'amount')
        .innerJoin('unassigned.user', 'user')
        .where('user.id = :userId', { userId })
        .getRawOne();
        console.log(result);
        return result.amount;
    }
}
