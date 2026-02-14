import { Currency } from "src/modules/monedas/entities/moneda.entity";
import { Transaction } from "src/modules/transacciones/entities/transaccione.entity";
import { User } from "src/modules/usuarios/entities/usuario.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
    user: User;

    @Column({ type: 'text', default: 'General'})
    name: string;

    @ManyToOne(() => Currency, (moneda) => moneda.accounts, { nullable: false, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    currency: Currency;

    @Column({ 
        type: 'numeric', 
        precision: 10, 
        scale: 2, 
        default: 0,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    currentBalance: number;

    @OneToMany(() => Transaction, (transaction) => transaction.account)
    transactions: Transaction[];
}
