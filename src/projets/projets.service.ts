import { Injectable } from '@nestjs/common';
import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Projet } from './entities/projet.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { RoleEnum } from 'src/users/users.role_enum';

@Injectable()
export class ProjetsService {
  constructor(
    @InjectRepository(Projet)
    private projetsRepository: Repository<Projet>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    return this.projetsRepository.update(id, updateProjetDto).then(() => {
      return this.findOne(id);
    });
  }

  async remove(id: string, userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const projet = await this.projetsRepository.findOne({ where: { id } });
    
    if (projet?.ownerId !== userId && user?.role !== RoleEnum.ADMIN) {
      throw new Error('Vous n\'avez pas l\'autorisation de supprimer ce projet.');
    }

    await this.projetsRepository.delete(id);
  }
}
