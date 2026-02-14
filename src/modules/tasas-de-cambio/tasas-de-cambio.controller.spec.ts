import { Test, TestingModule } from '@nestjs/testing';
import { TasasDeCambioController } from './tasas-de-cambio.controller';
import { TasasDeCambioService } from './tasas-de-cambio.service';

describe('TasasDeCambioController', () => {
  let controller: TasasDeCambioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasasDeCambioController],
      providers: [TasasDeCambioService],
    }).compile();

    controller = module.get<TasasDeCambioController>(TasasDeCambioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
