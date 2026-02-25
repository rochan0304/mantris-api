import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { MonedasModule } from './modules/monedas/monedas.module';
import { TasasDeCambioModule } from './modules/tasas-de-cambio/tasas-de-cambio.module';
import { CuentasModule } from './modules/cuentas/cuentas.module';
import { AsignacionesModule } from './modules/asignaciones/asignaciones.module';
import { TransaccionesModule } from './modules/transacciones/transacciones.module';
import { CajaSinAsignarModule } from './modules/caja-sin-asignar/caja-sin-asignar.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import fs from 'fs';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          type: 'postgres',
          url: configService.get<string>('DB_URL'),
          autoLoadEntities: true,
          synchronize: true,
          logging: isProduction ? ['error'] : 'all',
          ssl: {
            rejectUnauthorized: false,
          },
        }
      }
    }),
    ScheduleModule.forRoot(),
    UsuariosModule, 
    MonedasModule, 
    TasasDeCambioModule, 
    CuentasModule, 
    AsignacionesModule, 
    TransaccionesModule, 
    CajaSinAsignarModule, 
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
