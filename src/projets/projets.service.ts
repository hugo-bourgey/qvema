import { Injectable } from '@nestjs/common';
import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Projet } from './entities/projet.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProjetsService {
  constructor(
    @InjectRepository(Projet)
    private projetsRepository: Repository<Projet>,
  ) {}

  async create(createProjetDto: CreateProjetDto) {
    const newProjet = this.projetsRepository.create(createProjetDto);
    const savedProjet = this.projetsRepository.save(newProjet);
    return plainToInstance(Projet, savedProjet);
  }

  async findAll() {
    const projets = plainToInstance(
      Projet,
      await this.projetsRepository.find(),
    );
    return projets;
  }

  async findOne(id: string) {
    const projet = plainToInstance(Projet, await this.projetsRepository.findOne({ where: { id } }))
        return projet;
  }

  update(id: string, updateProjetDto: UpdateProjetDto) {
    return `This action updates a #${id} projet`;
  }

  async remove(id: string) {
    await this.projetsRepository.delete(id);
  }
}
