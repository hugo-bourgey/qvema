import { Investment } from "src/investments/entities/investment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('projets')
export class Projet {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    budget: number;

    @Column()
    category: string;

    @Column()
    ownerId: string;

    @OneToMany(() => Investment, investment => investment.project)
    investments: Investment[];
}
