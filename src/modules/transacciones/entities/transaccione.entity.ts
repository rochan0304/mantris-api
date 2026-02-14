import { Assignment } from "src/modules/asignaciones/entities/asignacione.entity";
import { Account } from "src/modules/cuentas/entities/cuenta.entity";
import { Currency } from "src/modules/monedas/entities/moneda.entity";
import { ExchangeRate } from "src/modules/tasas-de-cambio/entities/tasas-de-cambio.entity";
import { User } from "src/modules/usuarios/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.transactions)
    user: User;

    @ManyToOne(() => Currency, (currency) => currency.transactions, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    currency: Currency;
    
    @ManyToOne(()=> ExchangeRate, (rate) => rate.transactions, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    rate: ExchangeRate;

    @ManyToOne(() => Account, (account) => account.transactions, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    account: Account;

    @ManyToOne(() => Assignment, (assignment) => assignment.transactions, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    assignment: Assignment;

    @Column({ 
        type: 'numeric', 
        precision: 10, 
        scale: 2, 
        transformer: { 
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    amount: number;

    @Column({ type: 'enum', enum: ['INGRESO', 'GASTO', 'TRANSFERENCIA', 'ASIGNACION'] })
    type: string;

    @CreateDateColumn({ type: 'timestamptz' })
    creationDate: Date;
}
