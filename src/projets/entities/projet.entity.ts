import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    ownerId: string
}
