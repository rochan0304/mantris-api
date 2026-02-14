import { Account } from "src/modules/cuentas/entities/cuenta.entity";
import { ExchangeRate } from "src/modules/tasas-de-cambio/entities/tasas-de-cambio.entity";
import { Transaction } from "src/modules/transacciones/entities/transaccione.entity";
import { User } from "src/modules/usuarios/entities/usuario.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('currencies')
export class Currency {
    @PrimaryColumn('varchar', { length: 5, unique: true })
    id: string;

    @Column('text')
    name: string

    @Column({ type: 'varchar', length: 5 })
    symbol: string;

    @OneToMany(() => User, (user) => user.currency)
    users: User[];

    @OneToMany(() => ExchangeRate, (rate) => rate.originCurrency)
    originRate: ExchangeRate[];

    @OneToMany(() => ExchangeRate, (rate) => rate.baseCurrency)
    destinationRate: ExchangeRate[];

    @OneToMany(() => Account, (account) => account.currency)
    accounts: Account[];

    @OneToMany(() => Transaction, (transaction) => transaction.currency)
    transactions: Transaction[];
}
