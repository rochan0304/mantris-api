import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './usuarios.service';
import { CreateUserDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usuariosService: UsersService) {}
}
