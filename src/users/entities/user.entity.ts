import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RoleEnum } from "../users.role_enum";
import * as bcrypt from 'bcrypt';
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

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    async validatePassword(plainPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, this.password);
    }
}