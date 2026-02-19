import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../usuarios/entities/usuario.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { DataSource } from 'typeorm';
import { Account } from '../cuentas/entities/cuenta.entity';
import { UnassignedBox } from '../caja-sin-asignar/entities/caja-sin-asignar.entity';
import bcrypt from 'node_modules/bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly dataSource: DataSource
    ){}

    async genToken(user: User) {
        const { id, email, role, currency } = user;
        const payload = {
            sub: id,
            email,
            baseCurrency: {
                id: currency.id,
                symbol: currency.symbol,
                name: currency.name,
            },
            role, 
        };

        return {
            acces_token: this.jwtService.sign(payload)
        };
    }    

    async register(registerData: RegisterDto) {
        const { password, passwordVerify, email } = registerData;
        
        const isMatch = password === passwordVerify;

        if (!isMatch) {
            throw new BadRequestException('Contraseñas no coinciden.');
        }

        const salt = await bcrypt.genSalt();
        const passHashed = await bcrypt.hash(password, salt);

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const newUser = await queryRunner.manager.insert(User, {
                ...registerData,
                password: passHashed,
                email: email.toLowerCase().trim(),
                currency: { id: 'BCV' },
            });
            if (!newUser) throw new Error('Error al crear el usuario.');

            const newAccount = await queryRunner.manager.insert(Account, { 
                user: { id: newUser.identifiers[0].id },
                currency: { id: 'BCV' }
            });
            if (!newAccount) throw new Error('Error al crear la cuenta.');

            const newUnassignedBox = await queryRunner.manager.save(UnassignedBox, {user: { id: newUser.identifiers[0].id }});
            if (!newUnassignedBox) throw new Error('Error al crear la caja.');

            await queryRunner.commitTransaction();

            return { newUser, newAccount, newUnassignedBox };

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;

        } finally {
            await queryRunner.release();
        }
    }
}
