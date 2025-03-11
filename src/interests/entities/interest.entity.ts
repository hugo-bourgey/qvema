import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('interests')
export class Interest {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @ManyToMany(() => User)
    @JoinTable()
    users: User[]
}
