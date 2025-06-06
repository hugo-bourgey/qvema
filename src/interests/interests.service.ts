import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Interest } from './entities/interest.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>
  ) {}

  async create(createInterestDto: CreateInterestDto) {
    const newInterest = this.interestsRepository.create(createInterestDto);
    const savedInterest = this.interestsRepository.save(newInterest);
    return plainToInstance(Interest, savedInterest);
  }

  async findAll() {
    const interests = plainToInstance(Interest, await this.interestsRepository.find());
    return interests;
  }

  async findOne(id: string) {
    const interest = plainToInstance(Interest, await this.interestsRepository.findOne({ where: { id } }));
    if (!interest) {
      throw new NotFoundException(`Intérêt ${id} non trouvé`);
    }
    return interest;
  }

  async update(id: string, updateInterestDto: UpdateInterestDto) {
    return this.interestsRepository.update(id, updateInterestDto).then(() => {
      return this.findOne(id);
    });
  }

  async remove(id: string) {
    await this.interestsRepository.delete(id);
  }
}
