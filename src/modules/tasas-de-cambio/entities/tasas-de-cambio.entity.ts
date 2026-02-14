import { Currency } from "src/modules/monedas/entities/moneda.entity";
import { Transaction } from "src/modules/transacciones/entities/transaccione.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('exchangeRate')
export class ExchangeRate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Currency, (currency) => currency.originRate, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    originCurrency: Currency;

    @ManyToOne(() => Currency, (currency) => currency.destinationRate, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    baseCurrency: Currency;

    @OneToMany(() => Transaction, (transaction) => transaction.rate)
    transactions: Transaction[];
    
    @Column({ type: 'numeric', precision: 10, scale: 2 })
    rate: number;

    @CreateDateColumn({ type: 'timestamptz' })
    creationDate: Date;
}
