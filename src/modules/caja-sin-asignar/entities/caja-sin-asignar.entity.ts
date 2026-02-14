import { User } from "src/modules/usuarios/entities/usuario.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('unassignedBox')
export class UnassignedBox {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ 
        type: 'decimal', 
        precision: 10, 
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        },
        default: 0.00
    })
    availableAmount: number;

    @OneToOne(() => User, (user) => user.unassignedBox, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user: User;
}
