import { Test, TestingModule } from '@nestjs/testing';
import { CajaSinAsignarService } from './caja-sin-asignar.service';

describe('CajaSinAsignarService', () => {
  let service: CajaSinAsignarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CajaSinAsignarService],
    }).compile();

    service = module.get<CajaSinAsignarService>(CajaSinAsignarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
