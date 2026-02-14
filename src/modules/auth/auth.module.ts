import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from '../usuarios/usuarios.service';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../usuarios/entities/usuario.entity';
import { Account } from '../cuentas/entities/cuenta.entity';
import { AccountsService } from '../cuentas/cuentas.service';
import { UnassignedBoxesService } from '../caja-sin-asignar/caja-sin-asignar.service';
import { UnassignedBox } from '../caja-sin-asignar/entities/caja-sin-asignar.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '180d' }
      })
    }),
    TypeOrmModule.forFeature([User, Account, UnassignedBox]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    AccountsService,
    UnassignedBoxesService
  ],
})
export class AuthModule {}
