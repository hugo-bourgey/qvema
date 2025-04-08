import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Interest } from 'src/interests/entities/interest.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashPassword,
    });

    const savedUser = this.usersRepository.save(newUser);
    return plainToInstance(User, savedUser); //pour exclure le mpd
  }

  async findAll() {
    const users = plainToInstance(User, await this.usersRepository.find());
    return users;
  }

  async findOne(id: string) {
    const user = plainToInstance(
      User,
      await this.usersRepository.findOne({ 
        where: { id },
        relations: ['interests']
      }),
    );
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
    }
    
    // Si un nouveau mot de passe est fourni, le hasher
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }
    
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
    }
    return { message: `Utilisateur avec ID ${id} supprimé avec succès` };
  }

  // Nouvelles méthodes pour gérer les intérêts des utilisateurs
  async addInterestToUser(userId: string, interestId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests']
    });
    
    if (!user) {
      throw new NotFoundException(`Utilisateur avec ID ${userId} non trouvé`);
    }
    
    const interest = await this.interestsRepository.findOne({
      where: { id: interestId }
    });
    
    if (!interest) {
      throw new NotFoundException(`Intérêt avec ID ${interestId} non trouvé`);
    }
    
    if (!user.interests) {
      user.interests = [];
    }
    
    // Vérifie si l'intérêt est déjà associé à l'utilisateur
    const interestExists = user.interests.some(i => i.id === interestId);
    if (interestExists) {
      return user;
    }
    
    user.interests.push(interest);
    await this.usersRepository.save(user);
    
    return plainToInstance(User, user);
  }

  async removeInterestFromUser(userId: string, interestId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests']
    });
    
    if (!user) {
      throw new NotFoundException(`Utilisateur avec ID ${userId} non trouvé`);
    }
    
    if (!user.interests) {
      return user;
    }
    
    user.interests = user.interests.filter(interest => interest.id !== interestId);
    await this.usersRepository.save(user);
    
    return plainToInstance(User, user);
  }

  async getUserInterests(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests']
    });
    
    if (!user) {
      throw new NotFoundException(`Utilisateur avec ID ${userId} non trouvé`);
    }
    
    return user.interests || [];
  }
}