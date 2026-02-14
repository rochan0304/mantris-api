import { Transaction } from "src/modules/transacciones/entities/transaccione.entity";
import { User } from "src/modules/usuarios/entities/usuario.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('assignments')
export class Assignment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.assignments, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user: User;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'enum', enum: ['FIJO', 'VARIABLE', 'AHORRO', 'EXTRA'] })
    type: string;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    assignedAmount: number;

    @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
    availableBalance: number;

    @OneToMany(() => Transaction, (transaction) => transaction.assignment)
    transactions: Transaction[];
}
