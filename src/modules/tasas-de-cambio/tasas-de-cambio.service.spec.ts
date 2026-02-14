import { Test, TestingModule } from '@nestjs/testing';
import { TasasDeCambioService } from './tasas-de-cambio.service';

describe('TasasDeCambioService', () => {
  let service: TasasDeCambioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasasDeCambioService],
    }).compile();

    service = module.get<TasasDeCambioService>(TasasDeCambioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
