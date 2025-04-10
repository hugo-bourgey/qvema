// investments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Investment } from './entities/investment.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Projet } from '../projets/entities/projet.entity';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private investmentsRepository: Repository<Investment>,
  ) {}

  async create(amount: number, investor: User, project: Projet) {
    const investment = this.investmentsRepository.create({
      amount,
      investor,
      project,
    });

    return await this.investmentsRepository.save(investment);
  }

  async findAllByInvestor(investorId: string) {
    return await this.investmentsRepository.find({
      where: { investor: { id: investorId } },
      relations: ['project'],
    });
  }

  async findByProject(projectId: string) {
    return await this.investmentsRepository.find({
      where: { project: { id: projectId } },
      relations: ['investor'],
    });
  }

  async remove(id: string, investorId: string) {
    const investment = await this.investmentsRepository.findOne({
      where: { id, investor: { id: investorId } },
    });

    if (!investment) {
      throw new NotFoundException('Investment not found or unauthorized');
    }

    await this.investmentsRepository.remove(investment);
  }
}
