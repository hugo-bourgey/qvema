import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
      await this.usersRepository.findOne({ where: { id } }),
    );
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    await this.usersRepository.delete(id);
  }
}
