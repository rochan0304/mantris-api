import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './usuarios.controller';
import { UsersService } from './usuarios.service';

describe('UsuariosController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
