import { Assignment } from "src/modules/asignaciones/entities/asignacione.entity";
import { UnassignedBox } from "src/modules/caja-sin-asignar/entities/caja-sin-asignar.entity";
import { Account } from "src/modules/cuentas/entities/cuenta.entity";
import { Currency } from "src/modules/monedas/entities/moneda.entity";
import { Transaction } from "src/modules/transacciones/entities/transaccione.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    email: string;

    @Column('text')
    password: string;

    @ManyToOne(() => Currency, (currency) => currency.users)
    currency: Currency;

    @Column({type: 'enum', enum: ['user', 'admin', 'editor'], default: 'user' })
    role: string;

    @OneToMany(() => Account, (account) => account.user)
    accounts: Account[];

    @OneToMany(() => Assignment, (assignment) => assignment.user)
    assignments: Assignment[];

    @OneToOne(() => UnassignedBox, (unassignedBox) => unassignedBox.user)
    @JoinColumn()
    unassignedBox: UnassignedBox;

    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions: Transaction[];
}
