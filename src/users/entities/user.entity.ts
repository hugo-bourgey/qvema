import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RoleEnum } from "../users.role_enum";
import { Exclude } from "class-transformer";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    email: string;

    @Exclude() //+modif à faire dans le service
    @Column()
    password: string;

    @Column({ nullable: true })
    firstname: string;

    @Column({ nullable: true })
    lastname: string;

    @Column({
        type: 'enum',
        enum: RoleEnum,
        default: RoleEnum.ENTREPRENEUR
    })
    role: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

}