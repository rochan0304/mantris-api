import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import bcrypt from 'node_modules/bcryptjs';
import { AccountsService } from '../cuentas/cuentas.service';
import { UnassignedBoxesService } from '../caja-sin-asignar/caja-sin-asignar.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;

    const salt = await bcrypt.genSalt();
    const passHashed = await bcrypt.hash(password, salt);
    
    try {
      const newUser = this.usersRepository.create({
        ...createUserDto,
        email: email.toLowerCase(),
        password: passHashed,
        currency: { id: 'USD' }
      });

      return await this.usersRepository.save(newUser);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Este email ya está en uso.');
      }  
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  async findOne(email: string) {
    const user = await this.usersRepository.findOne({ 
      where: { email: email.toLowerCase() },
      relations: ['currency']
    });

    return user;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const { boxId, currencyId } = updateUsuarioDto;
    
    const user = await this.usersRepository.preload({
      id
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return await this.usersRepository.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
