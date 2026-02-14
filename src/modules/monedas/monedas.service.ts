import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-moneda.dto';
import { UpdateCurrencyDto } from './dto/update-moneda.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './entities/moneda.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CurrenciesService implements OnModuleInit { // 1. Implementar la interfaz
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>, // 2. Inyectar el repositorio
  ) {}

  // 3. Este método se ejecuta al arrancar la app
  async onModuleInit() {
    // 4. Verificar si ya existen datos
    const count = await this.currencyRepository.count();
    
    if (count > 0) {
      console.log('⚠️ Currencies already exist, skipping seed.');
      return; 
    }

    // 5. Definir los datos por defecto
    const initialCurrencies = [
      { id: 'BCV', name: 'Dólar', symbol: '$' },
      { id: 'EUR', name: 'Euro', symbol: '€' },
      { id: 'USDT', name: 'Cripto', symbol: 'USDT' },
      { id: 'VES', name: 'Bolívar', symbol: 'Bs.' }
    ];

    // 6. Guardar en la base de datos
    await this.currencyRepository.save(initialCurrencies);
    console.log('✅ Currencies seeded successfully');
  }

  async getAllCurrencies() {
    const currencies = await this.currencyRepository.createQueryBuilder('c')
    .select('*')
    .getRawMany();

    return currencies;
  }
}