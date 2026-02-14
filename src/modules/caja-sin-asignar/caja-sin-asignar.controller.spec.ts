import { Test, TestingModule } from '@nestjs/testing';
import { CajaSinAsignarController } from './caja-sin-asignar.controller';
import { CajaSinAsignarService } from './caja-sin-asignar.service';

describe('CajaSinAsignarController', () => {
  let controller: CajaSinAsignarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CajaSinAsignarController],
      providers: [CajaSinAsignarService],
    }).compile();

    controller = module.get<CajaSinAsignarController>(CajaSinAsignarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
