import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Projet } from 'src/projets/entities/projet.entity';

@Entity()
export class Investment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  investorId: string;

  @Column()
  projectId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn({ type: 'timestamp' })
  date: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'investorId' })
  investor: User;

  @ManyToOne(() => Projet, project => project.investments)
  @JoinColumn({ name: 'projectId' })
  project: Projet;
}